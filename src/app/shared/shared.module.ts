import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FooterComponent} from './components/footer/footer.component';
import {AngularMaterialModule} from '../material.module';
import {RouterModule} from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AreaComponent} from './widgets/area/area.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {CardComponent} from './widgets/card/card.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AreaComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    MatProgressBarModule,
    HighchartsChartModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AreaComponent,
    CardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedModule {
}
