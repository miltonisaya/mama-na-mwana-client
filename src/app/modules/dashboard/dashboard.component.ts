import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {MatTableDataSource} from '@angular/material/table';
import {TransactionsService} from '../transactions/transactions.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NotifierService} from '../notifications/notifier.service';
import {DataElement} from "../data-elements/dataElement";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  displayedColumns: string[] = ["sno", 'dateProcessed','payload','isSent','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageSize = 5;
  pageNo = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100, 1000];
  titleCouncils: String =  "Registration of mothers by councils";
  titleMonths: String =  "Registration of mothers by months";
  registrationByCouncilIsReady: boolean = false;
  pieChartCouncil: any;
  numberOfRegisteredContacts: any;
  numberOfRegisteredContactsIsReady: boolean = false;
  bigChartsIsReady: boolean = false;

  constructor(
    public dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private notifierService: NotifierService
  ) {

  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.populateBigChartByCouncil();
    this.populatePieChartByCouncil();
    this.populatePieChartMonthly();
    this.getAllTransactions();
    this.getTotalNumberOfRegisteredContacts();
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
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  getTotalNumberOfRegisteredContacts(){
    return this.dashboardService.getNumberOfAllContacts().subscribe((response: any) => {
      this.numberOfRegisteredContacts = response.data;
      this.numberOfRegisteredContactsIsReady = true;
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      console.log(error);
    });
  }

  resend(transaction: any) {
    return this.transactionService.resetTrx({id: transaction.id}).subscribe((response: any) => {
      this.notifierService.showNotification(response.message,'OK','success');
      this.getAllTransactions();
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      console.log(error);
    });
  }

  pageChanged(e: any) {
    console.log(e);
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
        // console.log(entries[0]);
      });
      this.bigChart = finalResult;
      this.bigChartsIsReady = true;
      // console.log(finalResult);
    });
  }

  getRegistrationsByDate(data) {
    let params = {
      startDate :data.startDate,
      endDate: data.endDate
    };

    if (this.dashboardService.registrationsForm.valid) {
      this.dashboardService.findRegistrationsByDate(this.dashboardService.registrationsForm.value, params).subscribe((response : any) => {
          this.notifierService.showNotification(response.message,'OK', 'success');
        });
    }
  }
}
