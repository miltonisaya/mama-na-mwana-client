import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultComponent} from './default.component';
import {DashboardComponent} from '../../modules/dashboard/dashboard.component';
import {UsersComponent} from '../../modules/users/users.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';



@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatSidenavModule
  ]
})
export class DefaultModule { }
