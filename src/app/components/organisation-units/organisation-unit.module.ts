import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {OrganisationUnitDialogComponent} from './modals/organisation-unit-dialog-component';
import {OrganisationUnitComponent} from './organisation-unit.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: OrganisationUnitComponent}
    ])
  ],
  declarations: [
    OrganisationUnitComponent,
    OrganisationUnitDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganisationUnitModule {
}
