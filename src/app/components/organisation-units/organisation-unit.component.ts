import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotifierService} from '../notifications/notifier.service';
import {OrganisationUnitService} from './organisation-unit.service';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

/** Flat node with expandable and level information */
interface OuNode {
  expandable: boolean;
  name: string;
  level: number;
  children?: OuNode[];

}

@Component({
  selector: 'app-organisation-units',
  templateUrl: './organisation-unit.component.html',
  styleUrls: ['./organisation-unit.component.scss']
})

export class OrganisationUnitComponent implements OnInit {
  treeControl = new NestedTreeControl<OuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OuNode>();
  selectedNode: any;

  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  organisationUnitId;
  data;
  isSuperAdministrator: any;

  constructor(
    private OrganisationUnitService: OrganisationUnitService,
    private Dialog: MatDialog,
    private NotifierService: NotifierService,
) {}

  ngOnInit(): void {
    this.getParentOrganisationUnits();
    this.checkIsAdmin();
  }

  checkIsAdmin(){
    let mnmUser = JSON.parse(localStorage.getItem("MNM_USER"));
    if(mnmUser.isSuperAdministrator){
      this.isSuperAdministrator = true;
    }
  }

  /**
   * This method returns the parent organisation units
   */
  getParentOrganisationUnits() {
    return this.OrganisationUnitService.getOrganisationUnits().subscribe((response: any) => {
      this.dataSource.data = response.data;
    }, error => {
      this.NotifierService.showNotification(error.error.error,'OK', 'error');
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
      this.Dialog.open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getParentOrganisationUnits();
      });
    } else {
      dialogConfig.data = {};
      this.Dialog.open(OrganisationUnitDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getParentOrganisationUnits();
      });
    }
  }

  openDeleteDialog(id) {
    this.organisationUnitId = id;
    this.Dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getParentOrganisationUnits();
    });
  }

  delete() {
    this.OrganisationUnitService.delete(this.organisationUnitId)
      .subscribe(response => {
        this.NotifierService.showNotification(response.message,'OK','success');
        this.getParentOrganisationUnits();
      }, error => {
        this.NotifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.Dialog.closeAll();
  }

  hasNestedChild(index: number, node: any){
    return node?.children.length >0;
  }

  onNodeClick(node) {
    this.selectedNode = node;
  }
}
