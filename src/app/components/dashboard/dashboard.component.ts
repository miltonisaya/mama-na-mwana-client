import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionsService } from '../transactions/transactions.service';
import { NotifierService } from '../notifications/notifier.service';
import { ContactsService } from "../contacts/contacts.service";
import { MatDialog } from "@angular/material/dialog";
import { OrganisationUnitService } from "../organisation-units/organisation-unit.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
  isSuperAdministrator = false;
  isLoading = false;
  sentCount = 0;
  pendingCount = 0;
  failedCount = 0;
  sentIsReady = false;
  pendingIsReady = false;
  failedIsReady = false;
  contactsBySexData: any[] = [];
  contactsBySexIsReady = false;

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

  constructor(
    public dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private notifierService: NotifierService,
    private contactsService: ContactsService,
    private organisationUnitService: OrganisationUnitService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkIsAdmin();
    this.getTotalNumberOfRegisteredContactsToday();
    this.refreshAll();
  }

  checkIsAdmin() {
    const raw = localStorage.getItem("MNM_USER");
    const mnmUser = raw ? JSON.parse(raw) : null;
    this.isSuperAdministrator = !!mnmUser?.isSuperAdministrator;
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
  }

  applyCustomFilter() {
    this.activePreset = 'custom';
    this.filterStartDate = this.customStartDate || null;
    this.filterEndDate = this.customEndDate || null;
    this.refreshAll();
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
    this.getTotalNumberOfRegisteredContacts(params);
    if (this.isSuperAdministrator) {
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
