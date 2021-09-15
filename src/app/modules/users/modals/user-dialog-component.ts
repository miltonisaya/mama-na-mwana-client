import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {UsersService} from '../users.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog-component.html',
  styleUrls: ['user-dialog.component.sass']
})

export class UserDialogComponent implements OnInit {
  constructor(
    public UserService: UsersService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.UserService.form.valid) {
      if (this.UserService.form.get('id').value) {
        this.UserService.updateUser(this.UserService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          });
      } else {
        this.UserService.createUser(this.UserService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.message,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.UserService.form.reset();
    this.UserService.initializeFormGroup();
    this.dialogRef.close();
  }
}
