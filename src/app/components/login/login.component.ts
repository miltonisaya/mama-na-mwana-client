import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotifierService } from '../notifications/notifier.service';
import { LoginFormControls, createLoginForm } from './login.form';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  form!: FormGroup<LoginFormControls>;
  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifier: NotifierService,
  ) {}

  ngOnInit(): void {
    this.form = createLoginForm();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.form.getRawValue()).subscribe({
      next: response => {
        this.notifier.showNotification(response.message, 'OK', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        // AuthService uses HttpBackend (bypasses interceptors), so errors are
        // handled here rather than by the global ErrorInterceptor.
        const message = err.error?.error || err.error?.message || 'Login failed. Please try again.';
        this.notifier.showNotification(message, 'OK', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
