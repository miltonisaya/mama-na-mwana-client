import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule} from './layouts/default/default.module';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RolesService} from './components/roles/roles.service';
import { LoginComponent } from './components/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {AngularMaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {RolesModule} from './components/roles/role.module';
import { NotifierComponent } from './components/notifications/notifier/notifier.component';
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
import { MenuService } from './components/menus/menu.service';
import {DashboardModule} from "./components/dashboard/dashboard.module";
import {ReportModule} from "./components/reports/report.module";
import {ReportService} from "./components/reports/report.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotifierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    DefaultModule,
    MatCardModule,
    MatFormFieldModule,
    FlexModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RolesModule,
    LoginModule,
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
    ReportModule
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
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    AuthGuard
  ],
  exports: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
