import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ReportService} from './report.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {Report} from './report';
import {NotifierService} from '../notifications/notifier.service';
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";

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
  roleId: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  treeControl = new NestedTreeControl<ReportNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ReportNode>();
  hasChild = (_: number, node: ReportNode) => !!node.children && node.children.length > 0;
  constructor(
    private ReportService: ReportService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getTree();
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

  openDeleteDialog(id) {
    this.roleId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getTree();
    });
  }

  delete() {
    this.ReportService.delete(this.roleId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.dialog.closeAll();
  }

  // hasNestedChild: (index: number, node: ReportNode){
  //   return node?.children?.length > 0;
  // }
  hasNestedChild(index: number, node: any){
    return node?.children.length >0;
  }

}
