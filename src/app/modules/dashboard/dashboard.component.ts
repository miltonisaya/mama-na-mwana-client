import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {MatTableDataSource} from '@angular/material/table';
import {TransactionsService} from '../transactions/transactions.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NotifierService} from '../notifications/notifier.service';
import {DataElement} from "../data-elements/dataElement";

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

  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private notifierService: NotifierService
  ) {

  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    // this.bigChart = this.dashboardService.bigChart();
    // this.cards =this.dashboardService.cards();
    // this.barChart = this.dashboardService.barChart();
    this.populatePieChartByCouncil();
    this.populatePieChartMonthly();
    this.getAllTransactions();
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

  resend(transactions: any) {
    console.log(transactions);
  }

  pageChanged(e: any) {
      console.log(e);
      this.pageSize = e.pageSize;
      this.pageNo = e.pageIndex;
      this.getAllTransactions();
  }

  private populatePieChartMonthly() {
    this.dashboardService.getMonthlyRegistrations().subscribe((response)=>{
      this.pieChartMonthly = response.data;
      this.pieIsReady = true;
    });
  }

  private populatePieChartByCouncil() {
    this.dashboardService.getRegistrationsByCouncil().subscribe((response)=>{
      this.pieChartCouncil = response.data;
      this.registrationByCouncilIsReady = true;
    });
  }
}
