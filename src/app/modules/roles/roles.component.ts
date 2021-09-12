import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {rolesService} from './roles.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RolesDialogComponent} from './modals/roles-dialog-component';
import {Role} from './role';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-users',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns = ['name', 'description', 'actions'];
  roles: any = [];
  roleId: string;
  dataSource;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private roleService: rolesService,
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
    return this.roleService.getRoles().subscribe(response => {
      // console.log("Paginator", this.paginator);
      this.roles = response.data;
      this.dataSource = new MatTableDataSource<any>(this.roles.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.dataSource;
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
        description: data.description
      };
      this.roleService.populateForm(roleData);
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
  }m

  delete() {
    this.roleService.delete(this.roleId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.message,'OK','error')
      });
    this.dialog.closeAll();
  }
}
