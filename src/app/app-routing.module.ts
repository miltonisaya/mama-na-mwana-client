import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {DefaultComponent} from './layouts/default/default.component';
import {UsersComponent} from './modules/users/users.component';
import {RolesComponent} from './modules/roles/roles.component';
import {LoginComponent} from './modules/login/login.component';
import {FlowComponent} from './modules/flows/flow.component';
import {DataElementComponent} from './modules/data-elements/dataElement.component';
import {ContactsComponent} from './modules/contacts/contacts.component';
import {AuthGuard} from './helpers/auth.guard';
import {OrganisationUnitComponent} from './modules/organisation-units/organisation-unit.component';
import {ProgramComponent} from './modules/programs/program.component';
import {PickListModule} from 'primeng/picklist';


const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  canActivate: [AuthGuard],
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
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
    }, {
      path: 'contacts',
      component: ContactsComponent
    }, {
      path: 'organisation-units',
      component: OrganisationUnitComponent
    }, {
      path: 'programs',
      component: ProgramComponent
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
