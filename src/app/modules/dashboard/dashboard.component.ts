import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {MatTableDataSource} from '@angular/material/table';
import {Transaction} from './Transaction';
import {TransactionsService} from '../transactions/transactions.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  bigChart = [];
  cards = [];
  pieChart = [];
  barChart = [];

  pendingTransactions: any;
  sentTrx: any;
  displayedColumns: string[] = ["sno", 'dateProcessed','payload','status','actions'];
  contacts: any = [];
  dataSource: MatTableDataSource<Transaction>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionsService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.bigChart = this.dashboardService.bigChart();
    this.cards =this.dashboardService.cards();
    this.pieChart = this.dashboardService.pieChart();
    this.barChart = this.dashboardService.barChart();
    this.getPendingTrx();
    this.getSentTrx();
  }

  /**
   * This method returns the outgoing messages
   */
  getPendingTrx() {
    return this.transactionService.getPendingTransactions().subscribe((response: any) => {
      this.pendingTransactions = response.data;
      this.dataSource = new MatTableDataSource<Transaction>(this.pendingTransactions.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.pendingTransactions);
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  getSentTrx() {
    return this.transactionService.getSentTransactions().subscribe((response: any) => {
      this.sentTrx = response.data;
      this.dataSource = new MatTableDataSource<Transaction>(this.sentTrx.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.sentTrx);
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  tyrAgain(id) {
    console.log(id);
  }

  applyFilterTransactions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
