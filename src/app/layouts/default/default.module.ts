import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultComponent} from './default.component';
import {DashboardComponent} from '../../modules/dashboard/dashboard.component';
import {UsersComponent} from '../../modules/users/users.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {AngularMaterialModule} from '../../material.module';
import {RolesComponent} from '../../modules/roles/roles.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {DashboardService} from '../../modules/dashboard/dashboard.service';
import {DataElementComponent} from '../../modules/data-elements/dataElement.component';
import {OrganisationUnitComponent} from '../../modules/organisation-units/organisation-unit.component';
import {MatTreeModule} from '@angular/material/tree';
import {ProgramComponent} from '../../modules/programs/program.component';
import {MatTabsModule} from "@angular/material/tabs";
import {AuthorityComponent} from "../../modules/authorities/authority.component";
import {NgxJsonViewerModule} from "ngx-json-viewer";


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    UsersComponent,
    RolesComponent,
    DataElementComponent,
    OrganisationUnitComponent,
    ProgramComponent,
    AuthorityComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        AngularMaterialModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatCardModule,
        MatTreeModule,
        MatTabsModule,
        NgxJsonViewerModule
    ],
  providers: [
    DashboardService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DefaultModule { }
