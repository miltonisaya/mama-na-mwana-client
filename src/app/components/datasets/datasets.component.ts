import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NotifierService} from "../notifications/notifier.service";
import {MatDialog} from "@angular/material/dialog";
import {Dataset, DatasetsService} from "./datasets.service";
import {MatSelectChange} from "@angular/material/select";
import {DataElement} from "../data-elements/dataElement";

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'code', 'dhis2uid', 'actions'];
  programs: any = [];
  dataSource: MatTableDataSource<DataElement>;
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datasets: Dataset[];
  error: any;
  selectedDataSetId: any;
  dataElements: DataElement[];

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
    this.datasetsService.getAllDatasets().subscribe(response => {
      this.datasets = response.data.content;
    }, error => {
      this.error = error;
    });
  }

  syncDatasets() {
    this.datasetsService.syncDatasets().subscribe(res => {
      console.log('Sync Response =>', res.data.content);
    }, err => {
      this.error = err.message;
    });
  }

  applyFilter($event: KeyboardEvent) {
    console.log('Event =>', $event);
  }

  openMappingDialog(id) {
    console.log(id);
  }

  getDataElementsByDataset($event: MatSelectChange) {
    this.datasetsService.findByDataset(this.selectedDataSetId).subscribe(response => {
      this.dataElements = response.data.data;
      this.dataSource = new MatTableDataSource<DataElement>(response.data.content);
    }, error => {
      console.log(error);
    })
  }
}
