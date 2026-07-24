import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {PasswordResetComponent} from "./password-reset.component";
import {ProfileInfoComponent} from "./profile-info/profile-info.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: PasswordResetComponent}
    ])
  ],
  declarations: [
    PasswordResetComponent,
    ProfileInfoComponent,
    ChangePasswordComponent
  ]
})
export class PasswordResetModule {
}
