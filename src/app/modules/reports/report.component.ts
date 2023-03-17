import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ReportService} from './report.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {Report} from './report';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-users',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'description','isSuperAdministrator', 'actions'];
  roles: any = [];
  roleId: string;
  dataSource: MatTableDataSource<Report>;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };

  constructor(
    private RoleService: ReportService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getRoles();
  }

  /**
   * This method returns roles
   */
  getRoles() {
    this.params = {
      "pageNo" : this.pageNo,
      "pageSize" : this.pageSize
    };

    return this.RoleService.getRoles().subscribe((response: any) => {
      this.roles = response.data;
      this.dataSource = new MatTableDataSource<Report>(this.roles.content);
    }, error => {
      this.notifierService.showNotification(error.error.error,'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(data?): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const roleData = {
        id: data.id,
        name: data.name,
        isSuperAdministrator: data.isSuperAdministrator,
        description: data.description
      };
      this.RoleService.populateForm(roleData);
      this.dialog.open(ReportDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getRoles();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(ReportDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getRoles();
      });
    }
  }

  openDeleteDialog(id) {
    this.roleId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getRoles();
    });
  }

  delete() {
    this.RoleService.delete(this.roleId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.dialog.closeAll();
  }

  pageChanged(e: any) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getRoles();
  }
}
