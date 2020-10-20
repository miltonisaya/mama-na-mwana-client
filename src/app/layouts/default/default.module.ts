import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultComponent} from './default.component';
import {DashboardComponent} from '../../modules/dashboard/dashboard.component';
import {RouterModule} from '@angular/router';
import {UsersComponent} from '../../modules/users/users.component';



@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class DefaultModule { }
