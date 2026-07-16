import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {FooterComponent} from './components/footer/footer.component';
import {AngularMaterialModule} from '../material.module';
import {RouterModule} from '@angular/router';
import {AreaComponent} from './widgets/area/area.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {CardComponent} from './widgets/card/card.component';
import {PieComponent} from './widgets/pie/pie.component';
import {BarComponent} from './widgets/bar/bar.component';
import {FormsModule} from '@angular/forms';
import {AiAssistantComponent} from './components/ai-assistant/ai-assistant.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    BarComponent,
    AiAssistantComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    HighchartsChartModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    BarComponent,
    AiAssistantComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedModule {
}
