import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {UsersService} from '../users.service';
import {RolesService} from '../../roles/roles.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: 'user-dialog-component.html',
  styleUrls: ['user-dialog.component.sass']
})

export class UserDialogComponent implements OnInit {
  roles: any = [];

  constructor(
    public UserService: UsersService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public NotifierService: NotifierService,
    public RoleService: RolesService
  ) { }

  ngOnInit() {
    this.getRoles();
  }

  submitForm(data) {
    if (this.UserService.form.valid) {
      if (this.UserService.form.get('id').value) {
        this.UserService.updateUser(this.UserService.form.value)
          .subscribe(response => {
            this.NotifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          });
      } else {
        this.UserService.createUser(this.UserService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            console.log("Error =>", error);
            this.NotifierService.showNotification(error.error.error,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.UserService.form.reset();
    this.UserService.initializeFormGroup();
    this.dialogRef.close();
  }

  /**
   * This method returns roles
   */
  getRoles() {
    return this.RoleService.getRoles().subscribe((response: any) => {
      this.roles = response.data.content;
    }, error => {
      this.NotifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }
}
