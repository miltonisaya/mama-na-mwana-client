import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {RolesDialogComponent} from './modals/roles-dialog-component';
import {RoleAuthorityMappingDialogComponent} from "./modals/role-authority-mapping-dialog-component";
import {RolesComponent} from './roles.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: RolesComponent}
    ])
  ],
  declarations: [
    RolesComponent,
    RolesDialogComponent,
    RoleAuthorityMappingDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RolesModule {
}
