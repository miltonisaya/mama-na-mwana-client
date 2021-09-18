import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {DefaultComponent} from './layouts/default/default.component';
import {UsersComponent} from './modules/users/users.component';
import {RolesComponent} from './modules/roles/roles.component';
import {LoginComponent} from './modules/login/login.component';
import {FlowComponent} from './modules/flows/flow.component';
import {DataElementComponent} from './modules/data-elements/dataElement.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'users',
    component: UsersComponent
  },
    {
      path: 'roles',
      component: RolesComponent
    },
    {
      path: 'flows',
      component: FlowComponent
    }, {
      path: 'data-elements',
      component: DataElementComponent
    }
  ]
},
  {
    path: 'login',
    component: LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
