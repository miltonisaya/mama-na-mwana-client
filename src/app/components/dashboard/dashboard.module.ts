import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {PickListModule} from "primeng/picklist";
import {ReportParamsDialog} from "./modals/report-params-dialog";
import {DashboardComponent} from "./dashboard.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDialogModule,
    PickListModule,
    MatAutocompleteModule
  ],
  declarations: [
    ReportParamsDialog
  ],
  entryComponents: [
    DashboardComponent
  ],
  providers: []
})
export class DashboardModule {
}
