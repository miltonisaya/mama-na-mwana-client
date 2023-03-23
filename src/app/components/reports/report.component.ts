import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ReportService} from './report.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {NotifierService} from '../notifications/notifier.service';
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {ReportParamsDialog} from "./modals/report-params/report-params-dialog";

interface ReportNode {
  name: string;
  url: string;
  id: string;
  children?: ReportNode[];
}

@Component({
  selector: 'app-users',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportId: string;
  selectedNode: any;
  isSuperAdministrator: boolean;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  treeControl = new NestedTreeControl<ReportNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ReportNode>();
  private params: any;
  constructor(
    private ReportService: ReportService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getTree();
    this.checkIsAdmin();
  }

  checkIsAdmin(){
    let mnmUser = JSON.parse(localStorage.getItem("MNM_USER"));
    if(mnmUser.isSuperAdministrator){
      this.isSuperAdministrator = true;
    }
  }

  /**
   * This method returns roles
   */
  getTree() {
    return this.ReportService.getTree().subscribe((response: any) => {
      this.dataSource.data = response.data;
    }, error => {
      this.notifierService.showNotification(error.error.error,'OK', 'error');
    });
  }

  getReportParams(){
    return this.ReportService.getParams(this.selectedNode.url).subscribe((response:any) =>{
      this.params = response.data;
      console.log("The fetched params ->",this.params);
    }, error => {
      this.notifierService.showNotification(error.error.error,'OK','error');
    })
  }

  openDialog(data?): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const roleData = {
        id: data.id,
        name: data.name,
        url: data.url,
        parentId: data.parentId
      };
      this.ReportService.populateForm(roleData);
      this.dialog.open(ReportDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getTree();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(ReportDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getTree();
      });
    }
  }

  openDeleteDialog() {
    this.reportId = this.selectedNode.id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getTree();
    });
  }

  delete() {
    this.ReportService.delete(this.selectedNode.id)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.dialog.closeAll();
  }

  hasNestedChild(index: number, node: any){
    return node?.children.length >0;
  }

  onNodeClick(node: any){
    this.selectedNode = node;
    console.log("The selected node is->",node);
  }

  openReportParamsDialog() {
    //fetch params
    this.getReportParams();
    console.log("Opening dialog params");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //add params to config
    dialogConfig['params'] = this.params;
    this.dialog.open(ReportParamsDialog, {data: dialogConfig})
      .afterClosed().subscribe(() => {
      this.getTree();
    });
  }
}
