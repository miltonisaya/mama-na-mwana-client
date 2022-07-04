import { Component, OnInit } from '@angular/core';
import {AuthorityService} from '../authority.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-role-dialog',
  templateUrl: 'authority-dialog-component.html',
  styleUrls: ['authority-dialog.component.sass']
})

export class AuthorityDialogComponent implements OnInit {
  constructor(
    public RolesService: AuthorityService,
    public dialogRef: MatDialogRef<AuthorityDialogComponent>,
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
          });
      } else {
        this.RolesService.createRole(this.RolesService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.message,'OK', 'error');
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
