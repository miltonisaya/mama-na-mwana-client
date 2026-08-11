import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {RunsComponent} from './runs.component';
import {RunResponsesDialogComponent} from './modals/run-responses-dialog/run-responses-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: RunsComponent}
    ])
  ],
  declarations: [
    RunsComponent,
    RunResponsesDialogComponent
  ]
})
export class RunsModule {
}
