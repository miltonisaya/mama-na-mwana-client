import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { NotifierService } from '../notifications/notifier.service';
import { LoginFormControls, createLoginForm } from '../login/login.form';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    standalone: false
})
export class LoginDialogComponent implements OnInit {
  form!: FormGroup<LoginFormControls>;
  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notifier: NotifierService,
    private router: Router,
    private dialog: MatDialog,
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
        this.dialog.closeAll();
        const savedRoute = localStorage.getItem('CURRENT_ROUTE');
        const target = savedRoute ? JSON.parse(savedRoute) : '/dashboard';
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([target]);
        });
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
