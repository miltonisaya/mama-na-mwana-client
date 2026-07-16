import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {ReportParamsDialog} from "./modals/report-params-dialog";
import {DashboardComponent} from "./dashboard.component";
import {DashboardService} from './dashboard.service';
import {AiAssistantComponent} from './ai-assistant/ai-assistant.component';

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: '', component: DashboardComponent}
        ])
    ],
    declarations: [
        DashboardComponent,
        ReportParamsDialog,
        AiAssistantComponent
    ],
    providers: [
        DashboardService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule {
}
