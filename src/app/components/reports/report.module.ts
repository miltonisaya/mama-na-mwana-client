import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {PickListModule} from "primeng/picklist";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReportComponent} from "./report.component";
import {MatTreeModule} from "@angular/material/tree";
import {ReportParamsDialog} from "./modals/report-params/report-params-dialog";

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
    MatTreeModule,
  ],
    declarations: [
      ReportDialogComponent,
      ReportComponent,
      ReportParamsDialog
    ]
})
export class ReportModule {
}
