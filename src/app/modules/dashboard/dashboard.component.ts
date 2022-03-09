import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {MatTableDataSource} from '@angular/material/table';
import {Contact} from '../contacts/Contact';
import {Transaction} from './Transaction';
import {TransactionsService} from '../transactions/transactions.service';
import {Role} from '../roles/role';
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

  transactions: any;
  displayedColumns: string[] = ["sno", 'dateProcessed','payload','status','actions'];
  contacts: any = [];
  userId: string;
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
    this.getOutbox();
  }

  /**
   * This method returns the outgoing messages
   */
  getOutbox() {
    return this.transactionService.getTransactions().subscribe((response: any) => {
      this.transactions = response.data;
      this.dataSource = new MatTableDataSource<Transaction>(this.transactions.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.transactions);
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
