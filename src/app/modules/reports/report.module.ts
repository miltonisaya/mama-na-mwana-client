import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {ReportDialogComponent} from './modals/report-dialog-component';
import {PickListModule} from "primeng/picklist";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { ReportComponent } from './report.component';

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
      ReportDialogComponent,
      ReportComponent
    ]
})
export class ReportModule {
}
