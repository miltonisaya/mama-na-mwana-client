import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultComponent} from './default.component';
import {DashboardComponent} from '../../modules/dashboard/dashboard.component';
import {UsersComponent} from '../../modules/users/users.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {AngularMaterialModule} from '../../material.module';
import {RolesComponent} from '../../modules/roles/roles.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {DashboardService} from '../../modules/dashboard/dashboard.service';


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    UsersComponent,
    RolesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    AngularMaterialModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  providers: [
    DashboardService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DefaultModule { }
