import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {NotifierService} from "../notifications/notifier.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    public authService: AuthService,
    public notifierService: NotifierService,
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginProcess() {
    this.authService.login(this.formGroup.value)
      .subscribe(response => {
        if (response.data.user) {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          let currentRoute = JSON.parse(localStorage.getItem("CURRENT_ROUTE"));
          console.log("Current route =>",currentRoute);
          this.router.navigate([`${currentRoute}`]);
          this.dialog.closeAll();
        }
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
  }
}
