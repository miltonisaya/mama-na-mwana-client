import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {MatTableDataSource} from '@angular/material/table';
import {TransactionsService} from '../transactions/transactions.service';
import {MatPaginator} from '@angular/material/paginator';
import {NotifierService} from '../notifications/notifier.service';
import {DataElement} from "../data-elements/dataElement";
import {ContactsService} from "../contacts/contacts.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
  DataElementProgramMappingDialogComponent
} from "../programs/modals/data-element-program-mapping-dialog-component";
import {Program} from "../programs/program";
import {OrganisationUnitService} from "../organisation-units/organisation-unit.service";
import {ReportParamsDialog} from "./modals/report-params-dialog";

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
  dataSource;
  transactions: any;
  displayedColumns: string[] = ["sno", 'dateProcessed','payload','response','isSent','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = 5;
  pageNo = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100, 150, 500, 1000, 1500, 2000, 2500, 5000,10000];
  titleCouncils: String =  "Registration of mothers by councils";
  titleMonths: String =  "Registration of mothers by months";
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
  checkIsAdmin(){
    let mnmUser = JSON.parse(localStorage.getItem("MNM_USER"));
    if(mnmUser.isSuperAdministrator){
      this.isSuperAdministrator = true;
      this.getAllTransactions();
    }
  }
  getAllTransactions() {
    this.params = {
      "pageNo" : this.pageNo,
      "pageSize" : this.pageSize
    }

    return this.transactionService.getAll(this.params).subscribe((response: any) => {
      this.transactions = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.transactions.content);
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getTotalNumberOfRegisteredContacts(){
    return this.dashboardService.getNumberOfAllContacts().subscribe((response: any) => {
      this.numberOfRegisteredContacts = response.data;
      this.numberOfRegisteredContactsIsReady = true;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getTotalNumberOfRegisteredContactsToday(){
    return this.dashboardService.getNumberOfTodayContacts().subscribe((response: any) => {
      this.numberOfRegisteredContactsToday = response.data;
      this.numberOfRegisteredContactsTodayIsReady = true;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  resend(transaction: any) {
    return this.transactionService.resetTrx({id: transaction.id}).subscribe((response: any) => {
      this.notifierService.showNotification(response.message,'OK','success');
      this.getAllTransactions();
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  pageChanged(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getAllTransactions();
  }

  private populatePieChartMonthly() {
    this.dashboardService.getMonthlyRegistrations().subscribe((response : any)=>{
      this.pieChartMonthly = response.data;
      this.pieIsReady = true;
    });
  }

  private populatePieChartByCouncil() {
    this.dashboardService.getRegistrationsByCouncil().subscribe((response : any)=>{
      this.pieChartCouncil = response.data;
      this.registrationByCouncilIsReady = true;
    });
  }

  private populateBigChartByCouncil() {
    this.dashboardService.getNumberOfRegistrationsInBarChart().subscribe((response : any)=>{
      let result = response.data;
      let finalResult = [];

      result.forEach((x) => {
        var entries = Object.entries(x);
        finalResult.push(entries[0]);
      });
      this.bigChart = finalResult;
      this.bigChartsIsReady = true;
    }, error =>{
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  parseToJson(payload: any) {
    if(payload !== null && payload !== undefined){
      return JSON.parse(payload);
    } else {
      return {};
    }
  }
}
