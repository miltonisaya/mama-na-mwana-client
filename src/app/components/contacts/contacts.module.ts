import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {ContactsComponent} from './contacts.component';
import {ContactDialogComponent} from "./modals/contact-dialog-component";

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: ContactsComponent}
    ])
  ],
  declarations: [
    ContactsComponent,
    ContactDialogComponent
  ]
})
export class ContactsModule {
}
