import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {RolesDialogComponent} from './modals/roles-dialog-component';
import {RoleAuthorityMappingDialogComponent} from "./modals/role-authority-mapping-dialog-component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressBarModule,
  ],
  declarations: [
    RolesDialogComponent,
    RoleAuthorityMappingDialogComponent
  ]
})
export class RolesModule {
}
