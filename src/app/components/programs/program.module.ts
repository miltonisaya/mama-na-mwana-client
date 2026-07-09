import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DataElementProgramMappingDialogComponent} from "./modals/data-element-program-mapping-dialog-component";

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        MatDialogModule,
        MatCheckboxModule,
        MatDividerModule,
        MatProgressBarModule
    ],
    declarations: [
        DataElementProgramMappingDialogComponent
    ],
    providers: []
})
export class ProgramModule {
}
