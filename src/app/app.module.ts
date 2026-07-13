import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DefaultModule} from './layouts/default/default.module';
import {RouterModule} from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {RolesService} from './components/roles/roles.service';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AngularMaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './interceptors/auth-interceptor.service';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {LoginDialogModule} from './components/login-dialog/login-dialog.module';
import {RolesModule} from './components/roles/role.module';
import {NotifierComponent} from './components/notifications/notifier/notifier.component';
import {LoginModule} from './components/login/login.module';
import {UsersModule} from './components/users/users.module';
import {UsersService} from './components/users/users.service';
import {FlowService} from './components/flows/flow.service';
import {FlowsModule} from './components/flows/flow.module';
import {DataElementModule} from './components/data-elements/dataElement.module';
import {DataElementService} from './components/data-elements/dataElement.service';
import {FlowKeyService} from './components/flows/flowkey.service';
import {ContactsModule} from './components/contacts/contacts.module';
import {ContactsService} from './components/contacts/contacts.service';
import {TransactionsService} from './components/transactions/transactions.service';
import {OrganisationUnitModule} from './components/organisation-units/organisation-unit.module';
import {OrganisationUnitService} from './components/organisation-units/organisation-unit.service';
import {ProgramService} from './components/programs/program.service';
import {ProgramModule} from './components/programs/program.module';
import {AuthGuard} from "./helpers/auth.guard";
import {PasswordResetModule} from "./components/password-reset/password-reset.module";
import {AuthorityService} from "./components/authorities/authority.service";
import {AuthorityModule} from "./components/authorities/authority.module";
import {MenuModule} from "./components/menus/menu.module";
import {MenuService} from './components/menus/menu.service';
import {DashboardModule} from "./components/dashboard/dashboard.module";
import {ReportModule} from "./components/reports/report.module";
import {ReportService} from "./components/reports/report.service";
import { DatasetsComponent } from './components/datasets/datasets.component';
import {DatasetsService} from "./components/datasets/datasets.service";

@NgModule({
    declarations: [
        AppComponent,
        NotifierComponent,
        DatasetsComponent,
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        RouterModule,
        DefaultModule,
        MatCardModule,
        MatFormFieldModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RolesModule,
        LoginModule,
        LoginDialogModule,
        UsersModule,
        FlowsModule,
        DataElementModule,
        ContactsModule,
        OrganisationUnitModule,
        ProgramModule,
        MenuModule,
        PasswordResetModule,
        AuthorityModule,
        DashboardModule,
        ReportModule,
    ],
    providers: [
        RolesService,
        UsersService,
        FlowService,
        DataElementService,
        FlowKeyService,
        ContactsService,
        TransactionsService,
        OrganisationUnitService,
        ProgramService,
        AuthorityService,
        MenuService,
        ReportService,
        DatasetsService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        AuthGuard,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
