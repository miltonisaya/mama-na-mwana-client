import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {RolesComponent} from './roles.component';
import {RolesDialogComponent} from './modals/roles-dialog-component';
import {AngularMaterialModule} from '../../material.module';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
  ],
  entryComponents: [
  ]
})
export class RolesModule {
}
