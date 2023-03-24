import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {RolesDialogComponent} from './modals/roles-dialog-component';
import {RoleAuthorityMappingDialogComponent} from "./modals/role-authority-mapping-dialog-component";
import {PickListModule} from "primeng/picklist";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PickListModule,
    MatCheckboxModule,
  ],
  declarations: [
    RolesDialogComponent,
    RoleAuthorityMappingDialogComponent
  ]
})
export class RolesModule {
}
