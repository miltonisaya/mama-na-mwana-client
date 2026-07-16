import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {UserDialogComponent} from './modals/user-dialog-component';
import {UsersComponent} from './users.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: UsersComponent}
    ])
  ],
  declarations: [
    UsersComponent,
    UserDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {
}
