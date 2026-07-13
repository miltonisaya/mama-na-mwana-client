import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {PickListModule} from "primeng/picklist";
import {ReportParamsDialog} from "./modals/report-params-dialog";
import {DashboardComponent} from "./dashboard.component";
@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatDialogModule,
        PickListModule,
    ],
    declarations: [
        ReportParamsDialog
    ],
    providers: []
})
export class DashboardModule {
}
