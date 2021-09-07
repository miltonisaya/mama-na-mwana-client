import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FooterComponent} from './components/footer/footer.component';
import {AngularMaterialModule} from '../material.module';
import {RouterModule} from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule,
        MatProgressBarModule
    ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class SharedModule { }
