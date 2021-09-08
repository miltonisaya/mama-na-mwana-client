import { Component, OnInit } from '@angular/core';
import {rolesService} from '../roles.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'role-dialog-component.html',
  styleUrls: ['role-dialog.component.sass']
})

export class RolesDialogComponent implements OnInit {
  constructor(
    public rolesService: rolesService,
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    public notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.rolesService.form.valid) {
      if (this.rolesService.form.get('id').value) {
        this.rolesService.updateRole(this.rolesService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          });
      } else {
        this.rolesService.createRole(this.rolesService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.message,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.rolesService.form.reset();
    this.rolesService.initializeFormGroup();
    this.dialogRef.close();
  }
}
