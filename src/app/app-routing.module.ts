import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DefaultComponent} from './layouts/default/default.component';
import {UsersComponent} from './components/users/users.component';
import {RolesComponent} from './components/roles/roles.component';
import {LOGIN_ROUTES} from './components/login/login.routes';
import {FlowComponent} from './components/flows/flow.component';
import {DataElementComponent} from './components/data-elements/dataElement.component';
import {ContactsComponent} from './components/contacts/contacts.component';
import {AuthGuard} from './helpers/auth.guard';
import {OrganisationUnitComponent} from './components/organisation-units/organisation-unit.component';
import {ProgramComponent} from './components/programs/program.component';
import {PasswordResetComponent} from "./components/password-reset/password-reset.component";
import {AuthorityComponent} from "./components/authorities/authority.component";
import {MenuComponent} from './components/menus/menu.component';
import {ReportComponent} from './components/reports/report.component';
import {DatasetsComponent} from "./components/datasets/datasets.component";


// const routes: Routes = [{
//   path: '',
//   component: DefaultComponent,
//   canActivate: [AuthGuard],
//   children: [{
//     path: 'dashboard',
//     component: DashboardComponent,
//     canActivate: [AuthGuard],
//   }, {
//     path: 'users',
//     component: UsersComponent,
//     canActivate: [AuthGuard],
//   },
//     {
//       path: 'roles',
//       component: RolesComponent,
//       canActivate: [AuthGuard],
//     },
//     {
//       path: 'flows',
//       component: FlowComponent,
//       canActivate: [AuthGuard],
//     }, {
//       path: 'data-elements',
//       component: DataElementComponent,
//       canActivate: [AuthGuard],
//     }, {
//       path: 'contacts',
//       component: ContactsComponent,
//       canActivate: [AuthGuard],
//     }, {
//       path: 'organisation-units',
//       component: OrganisationUnitComponent,
//       canActivate: [AuthGuard],
//     }, {
//       path: 'programs',
//       component: ProgramComponent,
//       canActivate: [AuthGuard],
//     }, {
//       path: 'datasets',
//       component: DatasetsComponent,
//       canActivate: [AuthGuard],
//     }, {
//       path: 'profile',
//       component: PasswordResetComponent,
//       canActivate: [AuthGuard],
//     },
//     {
//       path: 'authorities',
//       component: AuthorityComponent,
//       canActivate: [AuthGuard]
//     },
//     {
//       path: 'manage-menus',
//       component: MenuComponent,
//       canActivate: [AuthGuard]
//     },
//     {
//       path: 'manage-reports',
//       component: ReportComponent,
//       canActivate: [AuthGuard]
//     }
//   ]
// },
//   {
//     path: 'login',
//     component: LoginComponent
//   }];

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      // Add default redirect for root path
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent }, // Removed redundant guard
      { path: 'users', component: UsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'flows', component: FlowComponent },
      { path: 'data-elements', component: DataElementComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'organisation-units', component: OrganisationUnitComponent },
      { path: 'programs', component: ProgramComponent },
      { path: 'datasets', component: DatasetsComponent },
      { path: 'profile', component: PasswordResetComponent },
      { path: 'authorities', component: AuthorityComponent },
      { path: 'manage-menus', component: MenuComponent },
      { path: 'manage-reports', component: ReportComponent },
    ],
  },
  ...LOGIN_ROUTES,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
