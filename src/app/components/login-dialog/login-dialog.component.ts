import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {NotifierService} from "../notifications/notifier.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  formGroup: UntypedFormGroup;
  hidePassword = true;

  constructor(
    public authService: AuthService,
    public notifierService: NotifierService,
    public router: Router,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required])
    });
  }

  loginProcess() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.authService.login(this.formGroup.value)
      .subscribe(response => {
        if (response.data.user) {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          let currentRoute = JSON.parse(localStorage.getItem("CURRENT_ROUTE"));
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`${currentRoute}`])
          });
          this.dialog.closeAll();
        }
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
  }
}
