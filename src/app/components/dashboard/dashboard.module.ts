import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
    providers: []
})
export class DashboardModule {
}
