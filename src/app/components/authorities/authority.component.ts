import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {AuthorityService} from './authority.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AuthorityDialogComponent} from './modals/authority-dialog-component';
import {Authority} from './authority';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-authorities',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss']
})
export class AuthorityComponent implements OnInit {
  displayedColumns: string[] = ["sno", 'name', 'description', 'actions'];
  authorities: any = [];
  authorityId: string;
  dataSource: MatTableDataSource<Authority>;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private params: { pageNo: number; pageSize: number };

  constructor(
    private AuthorityService: AuthorityService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getAuthorities();
  }

  /**
   * This method returns authorities
   */
  getAuthorities() {
    this.params = {
      "pageNo": this.pageNo,
      "pageSize": this.pageSize
    }

    return this.AuthorityService.getAuthorities(this.params).subscribe((response: any) => {
      this.authorities = response.data;
      this.dataSource = new MatTableDataSource<Authority>(this.authorities.content);
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
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
      const authorityData = {
        id: data.id,
        name: data.name,
        description: data.description
      };
      this.AuthorityService.populateForm(authorityData);
      this.dialog.open(AuthorityDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getAuthorities();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(AuthorityDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getAuthorities();
      });
    }
  }

  openDeleteDialog(id) {
    this.authorityId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getAuthorities();
    });
  }

  delete() {
    this.AuthorityService.delete(this.authorityId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
    this.dialog.closeAll();
  }

  pageChanged(e: any) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getAuthorities();
  }
}
