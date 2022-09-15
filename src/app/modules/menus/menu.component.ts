import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MenuService} from './menu.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MenuDialogComponent} from './modals/menu-dialog-component';
import {Menu} from './menu';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-users',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  displayedColumns: string[] = ["sno",'name', 'description', 'actions'];
  menus: any = [];
  menuId: string;
  dataSource: MatTableDataSource<Menu>;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  private params: { pageNo: number; pageSize: number };

  constructor(
    private MenuService: MenuService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getMenus();
  }

  /**
   * This method returns roles
   */
  getMenus() {
    this.params = {
      "pageNo" : this.pageNo,
      "pageSize" : this.pageSize
    };

    return this.MenuService.getMenus().subscribe((response: any) => {
      this.menus = response.data;
      this.dataSource = new MatTableDataSource<Menu>(this.menus.content);
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
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
      const menuData = {
        id: data.id,
        name: data.name,
        icon: data.icon
      };
      this.MenuService.populateForm(menuData);
      this.dialog.open(MenuDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getMenus();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(MenuDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getMenus();
      });
    }
  }

  openDeleteDialog(id) {
    this.menuId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getMenus();
    });
  }

  delete() {
    this.MenuService.delete(this.menuId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.message,'OK','error')
      });
    this.dialog.closeAll();
  }

  pageChanged(e: any) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    this.getMenus();
  }
}
