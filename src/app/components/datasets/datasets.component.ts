import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Program} from "../programs/program";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NotifierService} from "../notifications/notifier.service";
import {MatDialog} from "@angular/material/dialog";
import {DatasetsService} from "./datasets.service";

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css']
})
export class DatasetsComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'code', 'dhis2uid', 'actions'];
  programs: any = [];
  dataSource: MatTableDataSource<Program>;
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datasets: any;
  error: any;

  constructor(
    private datasetsService: DatasetsService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.fetchDatasets();
  }

  fetchDatasets(): void {
    this.datasetsService.getAllDatasets().subscribe({
      next: (data) => (this.datasets = data),
      error: (err) => (this.error = err.message),
    });
  }

  syncDatasets() {
    this.datasetsService.syncDatasets();
    this.fetchDatasets();
    console.log("Synchronizing data sets")
  }

  applyFilter($event: KeyboardEvent) {
    console.log('Event =>', $event);
  }

  openMappingDialog(id) {
    console.log(id);

  }
}
