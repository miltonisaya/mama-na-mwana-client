import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotifierService} from '../notifications/notifier.service';
import {UsersService} from "../users/users.service";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-users',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  userId: string;
  user;
  profileForm = this.fb.group({
    name: ['', Validators.required, Validators.minLength(3)],
    email: ['', Validators.required, Validators.email],
    phone: ['', Validators.required],
    username: ['', Validators.required, Validators.minLength(3)],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    oldPassword: ['', Validators.required],
    id: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notifierService: NotifierService,
    private userService: UsersService
  ) {
  }

  validateForm() {
    this.profileForm.addValidators(
      this.matchValidator(this.profileForm.get('password'), this.profileForm.get('confirmPassword'))
    );
  }

  matchValidator(
    control: AbstractControl,
    controlTwo: AbstractControl
  ): ValidatorFn {
    return () => {
      if (control.value !== controlTwo.value)
        return {match_error: 'The passwords do not match'};
      return null;
    };
  }

  ngOnInit(): void {
    this.findUserDetailsById();
  }

  findUserDetailsById() {
    let user = JSON.parse(localStorage.getItem("MNM_USER"));
    this.userId = user.id;
    let params = {
      "id": this.userId
    };

    this.userService.findById(params).subscribe((response) => {
      this.user = response.data;
      this.updateFormValues();
    }, (error) => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    })
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

  submitForm(profileForm: FormGroup) {
    this.userService.resetPassword(profileForm)
      .subscribe(response => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
  };
}
