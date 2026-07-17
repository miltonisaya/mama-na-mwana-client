import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UsersService} from './users.service';
import {NotifierService} from '../notifications/notifier.service';
import {User} from './User';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UserDialogComponent} from './modals/user-dialog-component';
import {userCan} from '../../helpers/user-can';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  displayedColumns: string[] = ["sno", 'name', 'username', 'email', 'roles', 'actions'];
  users: any = [];
  userId: string;
  dataSource: MatTableDataSource<User>;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];

  constructor(
    private UsersService: UsersService,
    private NotifierService: NotifierService,
    private DialogService: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    const params = { pageNo: this.pageNo, pageSize: this.pageSize };
    return this.UsersService.getUsers(params).subscribe((response: any) => {
      this.users = response.data;
      this.dataSource = new MatTableDataSource<User>(this.users?.content ?? []);
    }, error => {
      this.NotifierService.showNotification(error.message, 'OK', 'error');
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
    dialogConfig.width = '780px';
    dialogConfig.maxWidth = '95vw';
    dialogConfig.maxHeight = '90vh';
    if (data) {
      const userData = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        username: data.username,
        roles: data.roles
      };
      this.UsersService.populateForm(userData);
      this.DialogService.open(UserDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getUsers();
      });
    } else {
      dialogConfig.data = {};
      this.DialogService.open(UserDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getUsers();
      });
    }
  }

  openDeleteDialog(id) {
    this.userId = id;
    this.DialogService.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  delete() {
    this.UsersService.delete(this.userId)
      .subscribe(response => {
        this.NotifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.NotifierService.showNotification(error.message, 'OK', 'error')
      });
    this.DialogService.closeAll();
  }

  get totalElements(): number { return this.users?.totalElements ?? 0; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; this.getUsers(); }
  prevPage()  { this.pageNo--; this.getUsers(); }
  nextPage()  { this.pageNo++; this.getUsers(); }
  lastPage()  { this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getUsers(); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getUsers();
  }
}
