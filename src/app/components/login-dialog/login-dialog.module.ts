import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../material.module';
import { LoginDialogComponent } from './login-dialog.component';

@NgModule({
  declarations: [LoginDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
})
export class LoginDialogModule {}
