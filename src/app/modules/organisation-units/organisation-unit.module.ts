import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';

@NgModule({
  imports: [
    CommonModule,

    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDialogModule
  ],
  declarations: [
    OrganisationUnitDialogComponent
  ],
  entryComponents: [
    OrganisationUnitDialogComponent
  ]
})
export class OrganisationUnitModule {
}
