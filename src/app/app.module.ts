import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DefaultModule} from './layouts/default/default.module';
import {RouterModule} from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {RolesService} from './components/roles/roles.service';
import {AngularMaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './interceptors/auth-interceptor.service';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {LoginDialogModule} from './components/login-dialog/login-dialog.module';
import {NotifierComponent} from './components/notifications/notifier/notifier.component';
import {LoginModule} from './components/login/login.module';
import {UsersService} from './components/users/users.service';
import {FlowService} from './components/flows/flow.service';
import {DataElementService} from './components/data-elements/dataElement.service';
import {FlowKeyService} from './components/flows/flowkey.service';
import {ContactsService} from './components/contacts/contacts.service';
import {RunsService} from './components/runs/runs.service';
import {TransactionsService} from './components/transactions/transactions.service';
import {OrganisationUnitService} from './components/organisation-units/organisation-unit.service';
import {ProgramService} from './components/programs/program.service';
import {AuthGuard} from "./helpers/auth.guard";
import {AuthorityService} from "./components/authorities/authority.service";
import {MenuService} from './components/menus/menu.service';
import {ReportService} from "./components/reports/report.service";

@NgModule({
    declarations: [
        AppComponent,
        NotifierComponent,
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
        AngularMaterialModule,
        ReactiveFormsModule,
        LoginModule,
        LoginDialogModule,
    ],
    providers: [
        RolesService,
        UsersService,
        FlowService,
        DataElementService,
        FlowKeyService,
        ContactsService,
        RunsService,
        TransactionsService,
        OrganisationUnitService,
        ProgramService,
        AuthorityService,
        MenuService,
        ReportService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        AuthGuard,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
