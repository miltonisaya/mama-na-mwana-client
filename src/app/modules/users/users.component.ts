import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UsersService} from './users.service';
import {NotifierService} from '../notifications/notifier.service';
import {User} from './User';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UserDialogComponent} from './modals/user-dialog-component';
import {RolesService} from '../roles/roles.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'title','username','email','roles', 'actions'];
  users: any = [];
  userId: string;
  dataSource: MatTableDataSource<User>;
  pageSize;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private UsersService: UsersService,
    private NotifierService: NotifierService,
    private DialogService: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * This method returns users
   */
  getUsers() {
    return this.UsersService.getUsers().subscribe((response: any) => {
      this.users = response.data;
      this.dataSource = new MatTableDataSource<User>(this.users.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.NotifierService.showNotification(error.message,'OK','error');
      console.log(error);
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
      const userData = {
        id: data.id,
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        username: data.username,
        title: data.title,
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
        this.NotifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.NotifierService.showNotification(error.message,'OK','error')
      });
    this.DialogService.closeAll();
  }
}
