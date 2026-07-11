import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionsService } from '../transactions/transactions.service';
import { MatPaginator } from '@angular/material/paginator';
import { NotifierService } from '../notifications/notifier.service';
import { ContactsService } from "../contacts/contacts.service";
import { MatDialog } from "@angular/material/dialog";
import { OrganisationUnitService } from "../organisation-units/organisation-unit.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  bigChart = [];
  cards = [];
  pieChartMonthly = [];
  barChart = [];
  pieIsReady: boolean = false;
  params: object = {};
  dataSource = new MatTableDataSource<any>([]);
  transactions: any;
  totalElements = 0;
  displayedColumns: string[] = ['sno', 'dateProcessed', 'status', 'retries', 'actions'];
  expandedTrx: any = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = 5;
  pageNo = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100, 150, 500, 1000, 1500, 2000, 2500, 5000, 10000];
  titleCouncils: String = "Registration of clients by councils";
  titleMonths: String = "Registration of clients by months";
  registrationByCouncilIsReady: boolean = false;
  pieChartCouncil: any;
  numberOfRegisteredContacts: any;
  numberOfRegisteredContactsIsReady: boolean = false;
  bigChartsIsReady: boolean = false;
  numberOfRegisteredContactsToday: any;
  numberOfRegisteredContactsTodayIsReady: boolean = false;
  isSuperAdministrator: boolean;

  constructor(
    public dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private notifierService: NotifierService,
    private contactsService: ContactsService,
    private organisationUnitService: OrganisationUnitService,
    private dialog: MatDialog
  ) {

  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.populateBigChartByCouncil();
    this.populatePieChartByCouncil();
    this.populatePieChartMonthly();
    this.checkIsAdmin();
    this.getTotalNumberOfRegisteredContacts();
    this.getTotalNumberOfRegisteredContactsToday();
  }

  //Get the user info from local storage
  checkIsAdmin() {
    const raw = localStorage.getItem("MNM_USER");
    const mnmUser = raw ? JSON.parse(raw) : null;
    if (mnmUser?.isSuperAdministrator) {
      this.isSuperAdministrator = true;
      this.getAllTransactions();
    }
  }

  getAllTransactions() {
    this.params = { pageNo: this.pageNo, pageSize: this.pageSize };

    this.transactionService.getAll(this.params).subscribe({
      next: (response: any) => {
        const page = response.data;
        this.totalElements = page?.totalElements ?? 0;
        this.dataSource.data = page?.content ?? [];
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Failed to load transactions', 'OK', 'error');
      }
    });
  }

  getTotalNumberOfRegisteredContacts() {
    return this.dashboardService.getNumberOfAllContacts().subscribe((response: any) => {
      this.numberOfRegisteredContacts = response.data;
      this.numberOfRegisteredContactsIsReady = true;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getTotalNumberOfRegisteredContactsToday() {
    return this.dashboardService.getNumberOfTodayContacts().subscribe((response: any) => {
      this.numberOfRegisteredContactsToday = response.data;
      this.numberOfRegisteredContactsTodayIsReady = true;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  resend(transaction: any) {
    return this.transactionService.resetTrx({ id: transaction.id }).subscribe((response: any) => {
      this.notifierService.showNotification(response.message, 'OK', 'success');
      this.getAllTransactions();
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  pageChanged(e: any) {
    this.expandedTrx = null;
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getAllTransactions();
  }

  prettyJson(str: string): string {
    if (!str) return '—';
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
  }

  isAbandoned(trx: any): boolean {
    return !trx.isSent && (trx.numberOfRetries ?? 0) >= 4;
  }

  private populatePieChartMonthly() {
    this.dashboardService.getMonthlyRegistrations().subscribe((response: any) => {
      this.pieChartMonthly = response.data;
      this.pieIsReady = true;
    });
  }

  private populatePieChartByCouncil() {
    this.dashboardService.getRegistrationsByCouncil().subscribe((response: any) => {
      this.pieChartCouncil = response.data;
      this.registrationByCouncilIsReady = true;
    });
  }

  private populateBigChartByCouncil() {
    this.dashboardService.getNumberOfRegistrationsInBarChart().subscribe((response: any) => {
      let result = response.data;
      let finalResult = [];

      (result ?? []).forEach((x) => {
        var entries = Object.entries(x);
        finalResult.push(entries[0]);
      });
      this.bigChart = finalResult;
      this.bigChartsIsReady = true;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }
}
