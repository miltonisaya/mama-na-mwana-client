import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/shared/shared.module';
import {AngularMaterialModule} from '../../material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {FlowComponent} from './flow.component';
import {FlowKeyDialogComponent} from './modals/flow-key-dialog/flow-key-dialog-component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FlowCategoryDialogComponent} from "./modals/flow-category-dialog/flow-category-dialog-component";
import {PossibleTrueValuesComponent} from "./modals/possible-true-values-dialog/possible-true-values-component";
import {CategoryService} from "./category.service";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDialogModule,
    MatAutocompleteModule
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
