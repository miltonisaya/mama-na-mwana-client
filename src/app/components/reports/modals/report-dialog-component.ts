import {Component, OnInit} from '@angular/core';
import {ReportService} from '../report.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'report-dialog-component.html',
  styleUrls: ['report-dialog.component.sass']
})

export class ReportDialogComponent implements OnInit {
  reports: any;

  constructor(
    public reportService: ReportService,
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    public notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getAllReports();
  }

  getAllReports() {
    this.reportService.getReports().subscribe(response => {
      this.reports = response.data;
    })
  }

  submitForm(data) {
    if (this.reportService.form.valid) {
      if (this.reportService.form.get('id').value) {
        this.reportService.updateRole(this.reportService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      } else {
        this.reportService.createRole(this.reportService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.reportService.form.reset();
    this.reportService.initializeFormGroup();
    this.dialogRef.close();
  }
}
