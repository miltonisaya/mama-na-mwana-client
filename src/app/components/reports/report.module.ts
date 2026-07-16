import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {ReportComponent} from "./report.component";
import {ReportParamsDialog} from "./modals/report-params/report-params-dialog";

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: ReportComponent}
    ])
  ],
  declarations: [
    ReportDialogComponent,
    ReportComponent,
    ReportParamsDialog
  ]
})
export class ReportModule {
}
