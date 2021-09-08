import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule} from './layouts/default/default.module';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {rolesService} from './modules/roles/roles.service';
import { LoginComponent } from './modules/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {AngularMaterialModule} from './material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {RolesModule} from './modules/roles/role.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    RolesModule
  ],
  providers: [
    rolesService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
