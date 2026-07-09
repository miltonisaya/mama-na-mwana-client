import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
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
    FlexLayoutModule,
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
  entryComponents: [
    DataElementProgramMappingDialogComponent
  ],
  providers: []
})
export class ProgramModule {
}
