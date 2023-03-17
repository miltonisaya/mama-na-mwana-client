import { Component, OnInit } from '@angular/core';
import {ReportService} from '../report.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'report-dialog-component.html',
  styleUrls: ['report-dialog.component.sass']
})

export class ReportDialogComponent implements OnInit {
  constructor(
    public RolesService: ReportService,
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    public notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.RolesService.form.valid) {
      if (this.RolesService.form.get('id').value) {
        this.RolesService.updateRole(this.RolesService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error,'OK', 'error');
          });
      } else {
        this.RolesService.createRole(this.RolesService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.error.error,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.RolesService.form.reset();
    this.RolesService.initializeFormGroup();
    this.dialogRef.close();
  }
}
