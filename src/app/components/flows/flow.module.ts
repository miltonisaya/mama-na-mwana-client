import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {FlowComponent} from './flow.component';
import {FlowKeyDialogComponent} from './modals/flow-key-dialog/flow-key-dialog-component';
import {FlowCategoryDialogComponent} from "./modals/flow-category-dialog/flow-category-dialog-component";
import {PossibleTrueValuesComponent} from "./modals/possible-true-values-dialog/possible-true-values-component";
import {CategoryService} from "./category.service";

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: FlowComponent}
    ])
  ],
  declarations: [
    FlowComponent,
    FlowKeyDialogComponent,
    FlowCategoryDialogComponent,
    PossibleTrueValuesComponent
  ], providers: [
    CategoryService
  ]
})
export class FlowsModule {
}
