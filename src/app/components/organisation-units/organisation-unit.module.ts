import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  declarations: [
    OrganisationUnitDialogComponent
  ]
})
export class OrganisationUnitModule {
}
