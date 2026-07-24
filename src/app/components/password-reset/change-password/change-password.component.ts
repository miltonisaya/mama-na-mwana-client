import { Component, Input } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NotifierService } from '../../notifications/notifier.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false
})
export class ChangePasswordComponent {
  @Input() userId: string;

  saving = false;
  hideOldPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;
  private matchValidatorAdded = false;

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private notifierService: NotifierService,
    private userService: UsersService
  ) {}

  validateForm() {
    if (!this.matchValidatorAdded) {
      this.passwordForm.addValidators(
        this.matchValidator(
          this.passwordForm.get('password'),
          this.passwordForm.get('confirmPassword')
        )
      );
      this.matchValidatorAdded = true;
    }
    this.passwordForm.updateValueAndValidity();
  }

  matchValidator(control: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
    return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Passwords do not match' };
      return null;
    };
  }

  submitForm(passwordForm: UntypedFormGroup) {
    if (passwordForm.invalid) {
      passwordForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = { value: { ...passwordForm.value, id: this.userId } };
    this.userService.resetPassword(payload).subscribe(
      response => {
        this.saving = false;
        this.notifierService.showNotification(response.message, 'OK', 'success');
        passwordForm.reset();
        this.matchValidatorAdded = false;
      },
      error => {
        this.saving = false;
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      }
    );
  }
}
