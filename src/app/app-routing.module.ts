import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DefaultComponent} from './layouts/default/default.component';
import {UsersComponent} from './components/users/users.component';
import {RolesComponent} from './components/roles/roles.component';
import {LoginComponent} from './components/login/login.component';
import {FlowComponent} from './components/flows/flow.component';
import {DataElementComponent} from './components/data-elements/dataElement.component';
import {ContactsComponent} from './components/contacts/contacts.component';
import {AuthGuard} from './helpers/auth.guard';
import {OrganisationUnitComponent} from './components/organisation-units/organisation-unit.component';
import {ProgramComponent} from './components/programs/program.component';
import {PasswordResetComponent} from "./components/password-reset/password-reset.component";
import {AuthorityComponent} from "./components/authorities/authority.component";
import { MenuComponent } from './components/menus/menu.component';
import { ReportComponent } from './components/reports/report.component';


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
    },
    {
      path: 'manage-menus',
      component: MenuComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'manage-reports',
      component: ReportComponent,
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
