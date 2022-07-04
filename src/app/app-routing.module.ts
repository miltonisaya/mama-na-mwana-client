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
import {PasswordResetComponent} from "./modules/password-reset/password-reset.component";
import {AuthorityComponent} from "./modules/authorities/authority.component";


const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  canActivate: [AuthGuard],
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  }, {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
    {
      path: 'roles',
      component: RolesComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'flows',
      component: FlowComponent,
      canActivate: [AuthGuard],
    }, {
      path: 'data-elements',
      component: DataElementComponent,
      canActivate: [AuthGuard],
    }, {
      path: 'contacts',
      component: ContactsComponent,
      canActivate: [AuthGuard],
    }, {
      path: 'organisation-units',
      component: OrganisationUnitComponent,
      canActivate: [AuthGuard],
    }, {
      path: 'programs',
      component: ProgramComponent,
      canActivate: [AuthGuard],
    }, {
      path: 'profile',
      component: PasswordResetComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'authorities',
      component: AuthorityComponent,
      canActivate: [AuthGuard]
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
