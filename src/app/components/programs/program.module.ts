import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {DataElementProgramMappingDialogComponent} from "./modals/data-element-program-mapping-dialog-component";
import {ProgramComponent} from './program.component';

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: '', component: ProgramComponent}
        ])
    ],
    declarations: [
        ProgramComponent,
        DataElementProgramMappingDialogComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgramModule {
}
