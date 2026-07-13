import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MenuService} from './menu.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MenuDialogComponent} from './modals/menu-dialog-component';
import {Menu} from './menu';
import {NotifierService} from '../notifications/notifier.service';
import {userCan} from '../../helpers/user-can';

// Menus are a small, bounded admin config list (not a paginated data feed), so the
// backend is asked for effectively "all of them" once, and filtering/pagination both
// run client-side over the full set. Pagination is sliced manually here rather than via
// MatPaginator: this app's Angular Material version (18.2.0-next.2) has MatPaginator
// itself failing to construct correctly (crashes reading pageSize/hidePageSize/disabled
// off a null instance) — not just its internal mat-select — so it's avoided entirely.
const FETCH_ALL_PAGE_SIZE = 1000;

@Component({
  selector: 'app-menus',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  displayedColumns: string[] = ["sno", 'name', 'icon', 'url', 'parent', 'authority', 'sortOrder', 'actions'];
  menuId: string;
  dataSource = new MatTableDataSource<Menu>([]);
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  pageNo = 0;
  pageSize = this.pageSizeOptions[0];

  constructor(
    private MenuService: MenuService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus() {
    const params = { pageNo: 0, pageSize: FETCH_ALL_PAGE_SIZE };
    return this.MenuService.getMenus(params).subscribe((response: any) => {
      this.dataSource.data = response.data?.content ?? [];
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
    });
  }

  // The table binds to this, not to `dataSource` directly, so it only ever renders
  // the current page of whatever is currently filtered.
  get visibleRows(): Menu[] {
    const start = this.pageNo * this.pageSize;
    return this.dataSource.filteredData.slice(start, start + this.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.pageNo = 0;
  }

  openDialog(data?): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const menuData = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        url: data.url,
        parentId: data.parentId,
        authorityId: data.authorityId,
        sortOrder: data.sortOrder
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
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
    this.dialog.closeAll();
  }

  get totalElements(): number { return this.dataSource.filteredData.length; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; }
  prevPage()  { this.pageNo--; }
  nextPage()  { this.pageNo++; }
  lastPage()  { this.pageNo = Math.max(0, Math.ceil(this.totalElements / this.pageSize) - 1); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
  }
}
