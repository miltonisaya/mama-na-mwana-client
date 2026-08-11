import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './layouts/default/default.component';
import {LOGIN_ROUTES} from './components/login/login.routes';
import {AuthGuard} from './helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('./components/roles/role.module').then(m => m.RolesModule),
      },
      {
        path: 'flows',
        loadChildren: () => import('./components/flows/flow.module').then(m => m.FlowsModule),
      },
      {
        path: 'data-elements',
        loadChildren: () => import('./components/data-elements/dataElement.module').then(m => m.DataElementModule),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./components/contacts/contacts.module').then(m => m.ContactsModule),
      },
      {
        path: 'runs',
        loadChildren: () => import('./components/runs/runs.module').then(m => m.RunsModule),
      },
      {
        path: 'organisation-units',
        loadChildren: () => import('./components/organisation-units/organisation-unit.module').then(m => m.OrganisationUnitModule),
      },
      {
        path: 'programs',
        loadChildren: () => import('./components/programs/program.module').then(m => m.ProgramModule),
      },
      {
        path: 'datasets',
        loadChildren: () => import('./components/datasets/datasets.module').then(m => m.DatasetsModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./components/password-reset/password-reset.module').then(m => m.PasswordResetModule),
      },
      {
        path: 'authorities',
        loadChildren: () => import('./components/authorities/authority.module').then(m => m.AuthorityModule),
      },
      {
        path: 'manage-menus',
        loadChildren: () => import('./components/menus/menu.module').then(m => m.MenuModule),
      },
      {
        path: 'manage-reports',
        loadChildren: () => import('./components/reports/report.module').then(m => m.ReportModule),
      },
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
