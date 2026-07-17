import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {NotifierService} from '../notifications/notifier.service';
import {DataElement} from './dataElement';
import {DataElementService} from './dataElement.service';
import {userCan} from '../../helpers/user-can';

@Component({
    selector: 'app-data-elements',
    templateUrl: './dataElement.component.html',
    styleUrls: ['./dataElement.component.scss'],
    standalone: false
})
export class DataElementComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  displayedColumns: string[] = ["sno", 'name', 'code', 'dataType', 'dhis2uid'];
  dataElements: any = [];
  dataSource: MatTableDataSource<DataElement>;
  syncing = false;

  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };

  constructor(
    private DataElementService: DataElementService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getDataElements();
  }

  getDataElements() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize
    }

    return this.DataElementService.getDataElements(this.params).subscribe((response: any) => {
      this.dataElements = response.data;
      this.dataSource = new MatTableDataSource<DataElement>(this.dataElements?.content ?? []);
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    if (!this.dataSource) return;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  syncDataElements() {
    this.syncing = true;
    return this.DataElementService.syncDataElements().subscribe((response: any) => {
      this.syncing = false;
      this.getDataElements();
      this.notifierService.showNotification(response.message || 'Data elements synced', 'OK', 'success');
    }, error => {
      this.syncing = false;
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  get totalElements(): number { return this.dataElements?.totalElements ?? 0; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; this.getDataElements(); }
  prevPage()  { this.pageNo--; this.getDataElements(); }
  nextPage()  { this.pageNo++; this.getDataElements(); }
  lastPage()  { this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getDataElements(); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getDataElements();
  }
}
