import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {rolesService} from './roles.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns = ['name', 'description', 'actions'];
  roles: any = [];
  roleId: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  public dataSource = new MatTableDataSource<any>();

  constructor(
    private roleService: rolesService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.getRoles();
  }

  /**
   * This method returns roles
   */
  getRoles() {
    return this.roleService.getRoles().subscribe(response => {
      this.roles = response.data;
      this.dataSource = this.roles.content;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    console.log("Open dialog");
  }

  openDeleteDialog(id) {
    this.roleId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getRoles();
    });
  }

  delete() {
    this.roleService.delete(this.roleId)
      .subscribe(response => {
      });
    this.dialog.closeAll();
  }
}
