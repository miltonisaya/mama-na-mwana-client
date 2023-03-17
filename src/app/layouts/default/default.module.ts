import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultComponent} from './default.component';
import {DashboardComponent} from '../../components/dashboard/dashboard.component';
import {UsersComponent} from '../../components/users/users.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {AngularMaterialModule} from '../../material.module';
import {RolesComponent} from '../../components/roles/roles.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {DashboardService} from '../../components/dashboard/dashboard.service';
import {DataElementComponent} from '../../components/data-elements/dataElement.component';
import {OrganisationUnitComponent} from '../../components/organisation-units/organisation-unit.component';
import {MatTreeModule} from '@angular/material/tree';
import {ProgramComponent} from '../../components/programs/program.component';
import {MatTabsModule} from "@angular/material/tabs";
import {AuthorityComponent} from "../../components/authorities/authority.component";
import {MenuComponent} from "../../components/menus/menu.component";
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
    AuthorityComponent,
    MenuComponent
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
