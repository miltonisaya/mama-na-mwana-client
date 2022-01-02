import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {of as observableOf} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';
import {OrganisationUnitService} from './organisation-unit.service';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {OrganisationUnit} from './organisation-unit';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';

/** Flat node with expandable and level information */
interface OuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './organisation-unit.component.html',
  styleUrls: ['./organisation-unit.component.scss']
})

export class OrganisationUnitComponent implements OnInit {
  treeControl = new FlatTreeControl<OuFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  private _transformer = (node: OrganisationUnit, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // treeControl = new NestedTreeControl<OrganisationUnit>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<OrganisationUnit>();
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  organisationUnitId;
  data;

  constructor(
    private OrganisationUnitService: OrganisationUnitService,
    private dialog: MatDialog,
    private notifierService: NotifierService,
) {
    // @ts-ignore
  }

  ngOnInit(): void {
    this.getParentOrganisationUnits();
  }

  /**
   * This method returns the parent organisation units
   */
  getParentOrganisationUnits() {
    return this.OrganisationUnitService.getOrganisationUnits().subscribe((response: any) => {
      this.dataSource.data = response.data;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.data.filter = filterValue.trim().toLowerCase();
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
        this.getParentOrganisationUnits();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getParentOrganisationUnits();
      });
    }
  }

  openDeleteDialog(id) {
    this.organisationUnitId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getParentOrganisationUnits();
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

  hasChild = (_: number, node: OuFlatNode) => node.expandable;
}
