import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {NotifierService} from '../notifications/notifier.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  response;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginProcess() {
    this.authService.login(this.formGroup.value)
      .subscribe(response => {
        console.log('the response', response)
        if (response.data.user) {
          this.notifierService.showNotification(response.message,'OK', 'success');
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        this.notifierService.showNotification(error.error.error,'OK', 'error');
      });
  }
}
