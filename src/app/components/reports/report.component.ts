import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ReportService} from './report.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {Report} from './report';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-users',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  roles: any = [];
  roleId: string;
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  private dataSource: MatTableDataSource<any>;

  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.getReports();
  }

  /**
   * This method returns reports
   */
  getReports() {
    return this.reportService.getReports().subscribe((response: any) => {
      this.roles = response.data;
      this.dataSource = new MatTableDataSource<Report>(this.roles.content);
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
        isSuperAdministrator: data.isSuperAdministrator,
        description: data.description
      };
      this.reportService.populateForm(roleData);
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
    this.roleId = id;
    this.dialog.open(this.deleteDialog)
      .afterClosed().subscribe(() => {
      this.getReports();
    });
  }

  delete() {
    this.reportService.delete(this.roleId)
      .subscribe(response => {
        this.notifierService.showNotification(response.message,'OK','success');
      }, error => {
        this.notifierService.showNotification(error.error.error,'OK', 'error');
      });
    this.dialog.closeAll();
  }


}
