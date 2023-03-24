import {Component, OnInit} from '@angular/core';
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
    public AuthorityService: AuthorityService,
    public dialogRef: MatDialogRef<AuthorityDialogComponent>,
    public notifierService: NotifierService
  ) {
  }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.AuthorityService.form.valid) {
      if (this.AuthorityService.form.get('id').value) {
        this.AuthorityService.updateAuthority(this.AuthorityService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.AuthorityService.createAuthority(this.AuthorityService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.AuthorityService.form.reset();
    this.AuthorityService.initializeFormGroup();
    this.dialogRef.close();
  }
}
