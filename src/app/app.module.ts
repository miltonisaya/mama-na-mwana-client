import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule} from './layouts/default/default.module';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RolesService} from './modules/roles/roles.service';
import { LoginComponent } from './modules/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {AngularMaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {RolesModule} from './modules/roles/role.module';
import { NotifierComponent } from './modules/notifications/notifier/notifier.component';
import {LoginModule} from './modules/login/login.module';
import {UsersModule} from './modules/users/users.module';
import {UsersService} from './modules/users/users.service';
import {FlowService} from './modules/flows/flow.service';
import {FlowsModule} from './modules/flows/flow.module';
import {DataElementModule} from './modules/data-elements/dataElement.module';
import {DataElementService} from './modules/data-elements/dataElement.service';
import {FlowKeyService} from './modules/flows/flowkey.service';
import {ContactsModule} from './modules/contacts/contacts.module';
import {ContactsService} from './modules/contacts/contacts.service';
import {TransactionsService} from './modules/transactions/transactions.service';
import {OrganisationUnitModule} from './modules/organisation-units/organisation-unit.module';
import {OrganisationUnitService} from './modules/organisation-units/organisation-unit.service';
import {ProgramService} from './modules/programs/program.service';
import {ProgramModule} from './modules/programs/program.module';
import {AuthGuard} from "./helpers/auth.guard";
import {PasswordResetModule} from "./modules/password-reset/password-reset.module";

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
    PasswordResetModule
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
