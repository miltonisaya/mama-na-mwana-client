import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';
import {DataElement} from './dataElement';
import {DataElementService} from './dataElement.service';

@Component({
  selector: 'app-data-elements',
  templateUrl: './dataElement.component.html',
  styleUrls: ['./dataElement.component.scss']
})
export class DataElementComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'code','dhis2uid'];
  dataElements: any = [];
  dataSource: MatTableDataSource<DataElement>;
  pageSize;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private DataElementService: DataElementService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getDataElements();
  }

  /**
   * This method returns data elements
   */
  getDataElements() {
    return this.DataElementService.getDataElements().subscribe((response: any) => {
      this.dataElements = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.dataElements.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncDataElements(){
    return this.DataElementService.syncDataElements().subscribe((response: any) => {
      console.log(response);
      this.getDataElements();
      if(response.status == '200'){
        this.notifierService.showNotification(response.message,'OK','success');
      }
    }, error => {
      this.notifierService.showNotification(error.error,'OK','error');
      console.log(error);
    });  }
}
