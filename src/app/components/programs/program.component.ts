import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {NotifierService} from '../notifications/notifier.service';
import {Program} from './program';
import {ProgramService} from './program.service';
import {MatDialog} from "@angular/material/dialog";
import {DataElementProgramMappingDialogComponent} from "./modals/data-element-program-mapping-dialog-component";
import {userCan} from '../../helpers/user-can';

@Component({
    selector: 'app-programs',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss'],
    standalone: false
})
export class ProgramComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  displayedColumns: string[] = ["sno", 'name', 'code', 'dhis2uid', 'actions'];
  programs: any = [];
  dataSource: MatTableDataSource<Program>;
  syncing = false;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  searchTerm = '';
  private searchDebounce: ReturnType<typeof setTimeout>;

  constructor(
    private ProgramService: ProgramService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPrograms();
  }

  getPrograms() {
    const params: any = { pageNo: this.pageNo, pageSize: this.pageSize };
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }
    return this.ProgramService.getDataElements(params).subscribe((response: any) => {
      this.programs = response.data;
      this.dataSource = new MatTableDataSource<Program>(this.programs?.content ?? []);
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchTerm = filterValue;
      this.pageNo = 0;
      this.getPrograms();
    }, 300);
  }

  syncPrograms() {
    this.syncing = true;
    return this.ProgramService.syncPrograms().subscribe((response: any) => {
      this.syncing = false;
      this.getPrograms();
      this.notifierService.showNotification(response.message, 'OK', 'success');
    }, error => {
      this.syncing = false;
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  openMappingDialog(id) {
    this.dialog.open(DataElementProgramMappingDialogComponent, {data: id, width: '750px', panelClass: 'data-element-mapping-dialog'})
      .afterClosed().subscribe(() => {
      this.getPrograms();
    });
  }

  get totalElements(): number { return this.programs?.totalElements ?? 0; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; this.getPrograms(); }
  prevPage()  { this.pageNo--; this.getPrograms(); }
  nextPage()  { this.pageNo++; this.getPrograms(); }
  lastPage()  { this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getPrograms(); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getPrograms();
  }
}
