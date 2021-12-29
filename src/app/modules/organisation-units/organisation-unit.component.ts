import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {of as observableOf} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';
import {OrganisationUnitService} from './organisation-unit.service';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {OrganisationUnit} from './organisation-unit';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

@Component({
  selector: 'app-users',
  templateUrl: './organisation-unit.component.html',
  styleUrls: ['./organisation-unit.component.scss']
})
export class OrganisationUnitComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  treeControl = new NestedTreeControl<OrganisationUnit>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OrganisationUnit>();
  organisationUnitId;
  data;

  constructor(
    private OrganisationUnitService: OrganisationUnitService,
    private dialog: MatDialog,
    private notifierService: NotifierService,
  ) {
    // @ts-ignore
  }

  private _getChildren = (node: OrganisationUnit) => observableOf(node.children);

  hasNestedChild = (_: number, nodeData: OrganisationUnit) => nodeData.children.length > 0;

  hasChild = (_: number, node: OrganisationUnit) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.getOrganisationUnits();
  }

  /**
   * This method returns organisation units
   */
  getOrganisationUnits() {
    console.log("get organisation units")
    let params = {
      pageSize: 100,
      sortBy: 'name'
    }
    return this.OrganisationUnitService.getOrganisationUnits(params).subscribe((response: any) => {
      this.dataSource.data = response.data.content;

      // this.organisationUnits = response.data;
      // this.dataSource = new MatTableDataSource<OrganisationUnit>(this.organisationUnits.content);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
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
      this.OrganisationUnitService.populateForm(roleData);
      this.dialog.open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getOrganisationUnits();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getOrganisationUnits();
      });
    }
  }

  openDeleteDialog(id) {
    this.organisationUnitId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getOrganisationUnits();
    });
  }

  delete() {
    this.OrganisationUnitService.delete(this.organisationUnitId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.message,'OK','error')
      });
    this.dialog.closeAll();
  }
}
