import {Component, Inject, OnInit} from '@angular/core';
import {ReportService} from '../report.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-report-dialog',
  templateUrl: 'report-dialog-component.html',
  styleUrls: ['report-dialog.component.sass']
})

export class ReportDialogComponent implements OnInit {
  reports: any;
  constructor(
    public ReportService: ReportService,
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    public notifierService: NotifierService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.ReportService.getAll().subscribe(response =>{
      this.reports = response.data.content;
    })
  }

  submitForm(data) {
    if (this.ReportService.form.valid) {
      if (this.ReportService.form.get('id').value) {
        this.ReportService.update(this.ReportService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error,'OK', 'error');
          });
      } else {
        this.ReportService.create(this.ReportService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK','success');
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.error.error,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.ReportService.form.reset();
    this.ReportService.initializeFormGroup();
    this.dialogRef.close();
  }
}
