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
  displayedColumns: string[] = ["sno",'name', 'code','dataType','dhis2uid'];
  dataElements: any = [];
  dataSource: MatTableDataSource<DataElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };

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
    this.params = {
      "pageNo" : this.pageNo,
      "pageSize" : this.pageSize
    }

    return this.DataElementService.getDataElements(this.params).subscribe((response: any) => {
      this.dataElements = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.dataElements.content);
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
      this.getDataElements();
      if(response.status == '200'){
        this.notifierService.showNotification(response.message,'OK','success');
      }
    }, error => {
      // console.log("The error===>",error.message);
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });  }

  pageChanged(e: any) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getDataElements();
  }
}
