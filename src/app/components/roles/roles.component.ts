import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {RolesService} from './roles.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RolesDialogComponent} from './modals/roles-dialog-component';
import {Role} from './role';
import {NotifierService} from '../notifications/notifier.service';
import {RoleAuthorityMappingDialogComponent} from "./modals/role-authority-mapping-dialog-component";
import {userCan} from '../../helpers/user-can';

@Component({
  selector: 'app-users',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  displayedColumns: string[] = ["sno", 'name', 'description', 'actions'];
  roles: any = [];
  roleId: string;
  dataSource: MatTableDataSource<Role>;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];

  constructor(
    private RoleService: RolesService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    return this.RoleService.getRoles().subscribe((response: any) => {
      this.roles = response.data;
      this.dataSource = new MatTableDataSource<Role>(this.roles?.content ?? []);
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  applyFilter(event: Event) {
    if (!this.dataSource) return;
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
        description: data.description
      };
      this.RoleService.populateForm(roleData);
      this.dialog.open(RolesDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getRoles();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(RolesDialogComponent, dialogConfig)
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
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
    this.dialog.closeAll();
  }

  openMappingDialog(role) {
    this.dialog.open(RoleAuthorityMappingDialogComponent, {
      data: role,
      width: '780px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
    }).afterClosed().subscribe(() => {
      this.getRoles();
    });
  }

  get totalElements(): number { return this.roles?.totalElements ?? 0; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; this.getRoles(); }
  prevPage()  { this.pageNo--; this.getRoles(); }
  nextPage()  { this.pageNo++; this.getRoles(); }
  lastPage()  { this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getRoles(); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getRoles();
  }
}
