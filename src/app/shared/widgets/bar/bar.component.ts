import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
  chartOptions = {};
  HighCharts = Highcharts;
  @Input() data = [];

  constructor() { }

  ngOnInit(): void {
    this.setBarChartOptions();
    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  setBarChartOptions (){
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Registration of Mothers by Councils'
      },
      subtitle: {
        text: 'Source: RapidPro'
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '10px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of registered mothers'
        }
      },
      legend: {
        enabled: true
      },
      tooltip: {
        pointFormat: 'Registration of Mothers by Councils'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none'
          }
        }
      },
      series: [{
        name: 'Councils',
        data: this.data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'center',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '10px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    };
  }
}
