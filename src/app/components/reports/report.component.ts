import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ReportService} from './report.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {NotifierService} from '../notifications/notifier.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from "@angular/material/tree";
import { Report } from './report';

let TREE_DATA: Report[] = [];

@Component({
  selector: 'app-users',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  treeControl = new NestedTreeControl<Report>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Report>();
  reportId: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;

  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.getReports();
  }

  /**
   * This method returns reports
   */
  getReports() {
    return this.reportService.getReports().subscribe((response: any) => {
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
      const reportData = {
        id: data.id,
        name: data.name,
        url: data.url,
        parent: data.parent.id
      };
      this.reportService.populateForm(reportData);
      this.dialog.open(ReportDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getReports();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(ReportDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getReports();
      });
    }
  }

  openDeleteDialog(id) {
    this.reportId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getReports();
    });
  }

  delete() {
    this.reportService.delete(this.reportId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.dialog.closeAll();
  }

  hasChild = (_: number, node: Report) => !!node.children && node.children.length > 0;
}
