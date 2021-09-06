import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {DefaultComponent} from './layouts/default/default.component';
import {UsersComponent} from './modules/users/users.component';
import {RolesComponent} from './modules/roles/roles.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [{
    path: '',
    component: DashboardComponent
  }, {
    path: 'users',
    component: UsersComponent
  },
    {
      path: 'roles',
      component: RolesComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
