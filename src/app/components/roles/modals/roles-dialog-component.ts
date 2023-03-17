import { Component, OnInit } from '@angular/core';
import {RolesService} from '../roles.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'role-dialog-component.html',
  styleUrls: ['role-dialog.component.sass']
})

export class RolesDialogComponent implements OnInit {
  constructor(
    public RolesService: RolesService,
    public dialogRef: MatDialogRef<RolesDialogComponent>,
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
