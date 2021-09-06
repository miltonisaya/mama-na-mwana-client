import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {rolesService} from './roles.service';

@Component({
  selector: 'app-users',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns = ['name', 'description'];
  roles: any = [];
  public dataSource = new MatTableDataSource<any>();

  constructor(private roleService: rolesService) { }

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

}
