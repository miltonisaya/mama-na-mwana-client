import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionsService } from '../transactions/transactions.service';
import { NotifierService } from '../notifications/notifier.service';
import { ContactsService } from "../contacts/contacts.service";
import { MatDialog } from "@angular/material/dialog";
import { OrganisationUnitService } from "../organisation-units/organisation-unit.service";
import { userCan } from '../../helpers/user-can';
import { DashboardSocketService } from './dashboard-socket.service';

// Presets the backend can broadcast a live snapshot for (see
// DashboardBroadcastServiceImpl) - "custom" ranges are inherently
// unbroadcastable (infinite possible date combinations), so those stay on
// the existing REST path only.
const LIVE_PRESET_IDS = ['all', '7d', '30d', '3m', 'ytd'];

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  bigChart = [];
  registrationsByCouncilData: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  totalElements = 0;
  displayedColumns: string[] = ['sno', 'dateProcessed', 'status', 'retries', 'actions'];
  expandedTrx: any = null;
  pageSize = 5;
  pageNo = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  titleMonthly: string = "Monthly Registrations";
  titleCouncilsBar: string = "Client Registrations by Council";
  registrationByCouncilIsReady = false;
  numberOfRegisteredContacts: any;
  numberOfRegisteredContactsIsReady = false;
  bigChartsIsReady = false;
  numberOfRegisteredContactsToday: any;
  numberOfRegisteredContactsTodayIsReady = false;
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  isLoading = false;
  sentCount = 0;
  pendingCount = 0;
  failedCount = 0;
  sentIsReady = false;
  pendingIsReady = false;
  failedIsReady = false;
  contactsBySexData: any[] = [];
  contactsBySexIsReady = false;
  contactsByAgeGroupData: any[] = [];
  contactsByAgeGroupIsReady = false;

  // Filter state
  filterStartDate: string | null = null;
  filterEndDate: string | null = null;
  activePreset: string = 'all';
  customStartDate: string = '';
  customEndDate: string = '';

  readonly presets = [
    { id: 'all',  label: 'All time' },
    { id: '7d',   label: 'Last 7 days' },
    { id: '30d',  label: 'Last 30 days' },
    { id: '3m',   label: 'Last 3 months' },
    { id: 'ytd',  label: 'This year' },
  ];

  newTransactionsCount = 0;

  // AI-generated survey narrative — regenerated hourly in the background
  // (see DashboardNarrativeServiceImpl), not tied to the date-range preset.
  narrativeText: string | null = null;
  narrativeGeneratedAt: string | null = null;
  narrativeIsReady = false;

  constructor(
    public dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private notifierService: NotifierService,
    private contactsService: ContactsService,
    private organisationUnitService: OrganisationUnitService,
    private dialog: MatDialog,
    private dashboardSocketService: DashboardSocketService
  ) {}

  ngOnInit(): void {
    this.getTotalNumberOfRegisteredContactsToday();
    // Initial REST fetch for instant first paint - the socket (connected
    // below) takes over keeping these same fields fresh every ~15s after
    // that, so there's no blank/loading wait for the first broadcast tick.
    this.refreshAll();
    this.loadNarrative();

    this.dashboardSocketService.connect(() => {
      this.dashboardSocketService.subscribeToPreset(this.activePreset === 'custom' ? 'all' : this.activePreset, snapshot => this.onDashboardSnapshot(snapshot));
      this.dashboardSocketService.subscribeToOutboxChanges(event => this.onOutboxChange(event));
      this.dashboardSocketService.subscribeToNarrative(narrative => this.onNarrativeUpdate(narrative));
    });
  }

  ngOnDestroy(): void {
    this.dashboardSocketService.disconnect();
  }

  // ── Live updates (WebSocket) ─────────────────────────────────────────────

  // Mirrors exactly what refreshAll()'s REST callbacks assign - a broadcast
  // for the currently-active preset just re-populates the same fields, so
  // the charts/counts stay fresh without the user ever refreshing.
  private onDashboardSnapshot(snapshot: any): void {
    const finalResult: any[] = [];
    (snapshot.monthlyRegistrations ?? []).forEach((x: any) => finalResult.push(Object.entries(x)[0]));
    this.bigChart = finalResult;
    this.bigChartsIsReady = true;

    this.registrationsByCouncilData = snapshot.registrationsByCouncil ?? [];
    this.registrationByCouncilIsReady = true;

    this.contactsBySexData = snapshot.contactsBySex ?? [];
    this.contactsBySexIsReady = true;

    this.contactsByAgeGroupData = snapshot.contactsByAgeGroup ?? [];
    this.contactsByAgeGroupIsReady = true;

    this.numberOfRegisteredContacts = snapshot.numberOfRegisteredContacts;
    this.numberOfRegisteredContactsIsReady = true;

    this.numberOfRegisteredContactsToday = snapshot.numberOfRegisteredContactsToday;
    this.numberOfRegisteredContactsTodayIsReady = true;

    if (this.userCan('OUTBOX_INDEX')) {
      this.sentCount = snapshot.sentCount ?? 0;
      this.sentIsReady = true;
      this.pendingCount = snapshot.pendingCount ?? 0;
      this.pendingIsReady = true;
      this.failedCount = snapshot.abandonedCount ?? 0;
      this.failedIsReady = true;
    }
  }

  // "UPDATED" (a row's status/retries/dhisResponse changed) is patched in
  // place wherever it's currently displayed - this never reorders or
  // resizes the page, so it's safe to apply regardless of which page or
  // filter the user currently has open. "CREATED" (a brand new row) is
  // deliberately NOT inserted into the table - that would reflow whatever
  // page the user is looking at out from under them - it just surfaces a
  // small "N new" indicator instead.
  private onOutboxChange(event: any): void {
    if (!this.dataSource || !this.userCan('OUTBOX_INDEX')) {
      return;
    }

    if (event.eventType === 'UPDATED') {
      const rows: any[] = this.dataSource.data;
      const index = rows.findIndex(r => r.id === event.outbox.id);
      if (index !== -1) {
        const updated = [...rows];
        updated[index] = event.outbox;
        this.dataSource.data = updated;
      }
    } else if (event.eventType === 'CREATED') {
      this.newTransactionsCount++;
    }
  }

  refreshTransactions(): void {
    this.newTransactionsCount = 0;
    this.getAllTransactions(this.filterParams);
    this.loadTransactionSummary(this.filterParams);
  }

  loadNarrative(): void {
    this.dashboardService.getNarrative().subscribe({
      next: (response: any) => {
        this.onNarrativeUpdate(response.data);
        this.narrativeIsReady = true;
      },
      error: () => { this.narrativeIsReady = true; }
    });
  }

  private onNarrativeUpdate(narrative: any): void {
    this.narrativeText = narrative?.narrative ?? null;
    this.narrativeGeneratedAt = narrative?.generatedAt ?? null;
  }

  // ── Filter ────────────────────────────────────────────────────────────────

  setPreset(presetId: string) {
    this.activePreset = presetId;
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    switch (presetId) {
      case 'all':
        this.filterStartDate = null;
        this.filterEndDate = null;
        break;
      case '7d':
        this.filterStartDate = fmt(new Date(today.getTime() - 7 * 86400000));
        this.filterEndDate = fmt(today);
        break;
      case '30d':
        this.filterStartDate = fmt(new Date(today.getTime() - 30 * 86400000));
        this.filterEndDate = fmt(today);
        break;
      case '3m':
        this.filterStartDate = fmt(new Date(today.getTime() - 90 * 86400000));
        this.filterEndDate = fmt(today);
        break;
      case 'ytd':
        this.filterStartDate = `${today.getFullYear()}-01-01`;
        this.filterEndDate = fmt(today);
        break;
    }

    this.customStartDate = this.filterStartDate ?? '';
    this.customEndDate = this.filterEndDate ?? '';
    this.refreshAll();

    if (LIVE_PRESET_IDS.includes(presetId)) {
      this.dashboardSocketService.subscribeToPreset(presetId, snapshot => this.onDashboardSnapshot(snapshot));
    } else {
      this.dashboardSocketService.unsubscribeFromPreset();
    }
  }

  applyCustomFilter() {
    this.activePreset = 'custom';
    this.filterStartDate = this.customStartDate || null;
    this.filterEndDate = this.customEndDate || null;
    this.refreshAll();
    // A custom range is one of infinitely many possible date combinations -
    // there's no topic the backend could be broadcasting it on, so this view
    // stays REST-only, same as before this feature existed.
    this.dashboardSocketService.unsubscribeFromPreset();
  }

  clearCustomFilter() {
    this.customStartDate = '';
    this.customEndDate = '';
    this.setPreset('all');
  }

  get filterParams(): any {
    const p: any = {};
    if (this.filterStartDate) p.startDate = this.filterStartDate;
    if (this.filterEndDate) p.endDate = this.filterEndDate;
    return Object.keys(p).length ? p : undefined;
  }

  get filterLabel(): string {
    if (!this.filterStartDate && !this.filterEndDate) return 'All time';
    const fmt = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (this.filterStartDate && this.filterEndDate) return `${fmt(this.filterStartDate)} – ${fmt(this.filterEndDate)}`;
    if (this.filterStartDate) return `From ${fmt(this.filterStartDate)}`;
    return `Until ${fmt(this.filterEndDate!)}`;
  }

  // ── Load all data ─────────────────────────────────────────────────────────

  refreshAll() {
    const params = this.filterParams;
    this.populateBigChartMonthly(params);
    this.populatePieChartByCouncil(params);
    this.loadContactsBySex(params);
    this.loadContactsByAgeGroup(params);
    this.getTotalNumberOfRegisteredContacts(params);
    if (this.userCan('OUTBOX_INDEX')) {
      this.pageNo = 0;
      this.expandedTrx = null;
      this.getAllTransactions(params);
      this.loadTransactionSummary(params);
    }
  }

  getAllTransactions(params?: any) {
    this.isLoading = true;
    const p = { pageNo: this.pageNo, pageSize: this.pageSize, ...(params ?? {}) };
    this.transactionService.getAll(p).subscribe({
      next: (response: any) => {
        const page = response.data;
        this.totalElements = page?.totalElements ?? 0;
        this.dataSource.data = page?.content ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.notifierService.showNotification(err?.error?.error ?? 'Failed to load transactions', 'OK', 'error');
      }
    });
  }

  loadTransactionSummary(params?: any) {
    this.transactionService.getSentCount(params).subscribe({
      next: (res: any) => { this.sentCount = res.data ?? 0; this.sentIsReady = true; },
      error: () => { this.sentIsReady = true; }
    });
    this.transactionService.getPendingCount(params).subscribe({
      next: (res: any) => { this.pendingCount = res.data ?? 0; this.pendingIsReady = true; },
      error: () => { this.pendingIsReady = true; }
    });
    // Abandoned is always all-time — unfiltered by design
    this.transactionService.getFailedCount().subscribe({
      next: (res: any) => { this.failedCount = res.data ?? 0; this.failedIsReady = true; },
      error: () => { this.failedIsReady = true; }
    });
  }

  loadContactsBySex(params?: any) {
    this.contactsBySexIsReady = false;
    this.dashboardService.getContactsBySex(params).subscribe({
      next: (res: any) => { this.contactsBySexData = res.data ?? []; this.contactsBySexIsReady = true; },
      error: () => { this.contactsBySexIsReady = true; }
    });
  }

  loadContactsByAgeGroup(params?: any) {
    this.contactsByAgeGroupIsReady = false;
    this.dashboardService.getContactsByAgeGroup(params).subscribe({
      next: (res: any) => { this.contactsByAgeGroupData = res.data ?? []; this.contactsByAgeGroupIsReady = true; },
      error: () => { this.contactsByAgeGroupIsReady = true; }
    });
  }

  getTotalNumberOfRegisteredContacts(params?: any) {
    this.numberOfRegisteredContactsIsReady = false;
    this.dashboardService.getNumberOfAllContacts(params).subscribe({
      next: (response: any) => { this.numberOfRegisteredContacts = response.data; this.numberOfRegisteredContactsIsReady = true; },
      error: (error) => { this.notifierService.showNotification(error.error.error, 'OK', 'error'); }
    });
  }

  getTotalNumberOfRegisteredContactsToday() {
    this.dashboardService.getNumberOfTodayContacts().subscribe({
      next: (response: any) => { this.numberOfRegisteredContactsToday = response.data; this.numberOfRegisteredContactsTodayIsReady = true; },
      error: (error) => { this.notifierService.showNotification(error.error.error, 'OK', 'error'); }
    });
  }

  get failedIsAlert(): boolean {
    return this.failedIsReady && this.failedCount > 0;
  }

  resend(transaction: any) {
    this.transactionService.resetTrx({ id: transaction.id }).subscribe({
      next: (response: any) => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.getAllTransactions(this.filterParams);
        this.loadTransactionSummary(this.filterParams);
      },
      error: (error) => { this.notifierService.showNotification(error.error.error, 'OK', 'error'); }
    });
  }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.expandedTrx = null; this.pageNo = 0; this.getAllTransactions(this.filterParams); }
  prevPage()  { this.expandedTrx = null; this.pageNo--; this.getAllTransactions(this.filterParams); }
  nextPage()  { this.expandedTrx = null; this.pageNo++; this.getAllTransactions(this.filterParams); }
  lastPage()  { this.expandedTrx = null; this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getAllTransactions(this.filterParams); }

  pageSizeChanged(e: any) {
    this.expandedTrx = null;
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getAllTransactions(this.filterParams);
  }

  prettyJson(str: string): string {
    if (!str) return '—';
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
  }

  isAbandoned(trx: any): boolean {
    return !trx.isSent && (trx.numberOfRetries ?? 0) >= 4;
  }

  private populatePieChartByCouncil(params?: any) {
    this.registrationByCouncilIsReady = false;
    this.dashboardService.getRegistrationsByCouncil(params).subscribe((response: any) => {
      this.registrationsByCouncilData = response.data ?? [];
      this.registrationByCouncilIsReady = true;
    });
  }

  private populateBigChartMonthly(params?: any) {
    this.bigChartsIsReady = false;
    this.dashboardService.getNumberOfRegistrationsInBarChart(params).subscribe({
      next: (response: any) => {
        const result = response.data ?? [];
        const finalResult: any[] = [];
        result.forEach((x: any) => {
          const entries = Object.entries(x);
          finalResult.push(entries[0]);
        });
        this.bigChart = finalResult;
        this.bigChartsIsReady = true;
      },
      error: (error) => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      }
    });
  }
}
