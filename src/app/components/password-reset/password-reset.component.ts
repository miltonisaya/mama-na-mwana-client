import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NotifierService} from '../notifications/notifier.service';
import {UsersService} from "../users/users.service";
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/forms";

@Component({
    selector: 'app-users',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss'],
    standalone: false
})
export class PasswordResetComponent implements OnInit {
  userId: string;
  user;
  saving = false;
  hideOldPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;
  private matchValidatorAdded = false;

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    oldPassword: ['', Validators.required],
    id: [''],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private notifierService: NotifierService,
    private userService: UsersService
  ) {}

  validateForm() {
    if (!this.matchValidatorAdded) {
      this.profileForm.addValidators(
        this.matchValidator(
          this.profileForm.get('password'),
          this.profileForm.get('confirmPassword')
        )
      );
      this.matchValidatorAdded = true;
    }
    this.profileForm.updateValueAndValidity();
  }

  matchValidator(control: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
    return () => {
      if (control.value !== controlTwo.value)
        return {match_error: 'Passwords do not match'};
      return null;
    };
  }

  ngOnInit(): void {
    this.findUserDetailsById();
  }

  findUserDetailsById() {
    const raw = localStorage.getItem("MNM_USER");
    const user = raw ? JSON.parse(raw) : null;
    this.userId = user?.id;

    this.userService.findById({id: this.userId}).subscribe((response) => {
      this.user = response.data;
      this.updateFormValues();
    }, (error) => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  updateFormValues() {
    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      username: this.user.username,
      id: this.user.id
    });
  }

  submitForm(profileForm: UntypedFormGroup) {
    if (profileForm.invalid) {
      profileForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.userService.resetPassword(profileForm).subscribe(
      response => {
        this.saving = false;
        this.notifierService.showNotification(response.message, 'OK', 'success');
        profileForm.patchValue({password: '', confirmPassword: '', oldPassword: ''});
        profileForm.get('password')?.markAsUntouched();
        profileForm.get('confirmPassword')?.markAsUntouched();
        profileForm.get('oldPassword')?.markAsUntouched();
      },
      error => {
        this.saving = false;
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      }
    );
  }
}
