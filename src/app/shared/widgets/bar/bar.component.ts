import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
    selector: 'app-widget-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss'],
    standalone: false
})
export class BarComponent implements OnInit, OnDestroy, AfterViewInit {
  chartOptions: any = {};
  HighCharts = Highcharts;
  @Input() data = [];
  @Input() title = 'Registrations';

  private resizeObserver: ResizeObserver | null = null;
  private chartRef: Highcharts.Chart | null = null;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.setBarChartOptions();
    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  ngAfterViewInit(): void {
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onChartInstance(chart: Highcharts.Chart): void {
    this.chartRef = chart;
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartRef) {
        setTimeout(() => {
          this.chartRef?.reflow();
        }, 100);
      }
    });

    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  setBarChartOptions() {
    this.chartOptions = {
      chart: {
        type: 'column',
        reflow: true,
        spacingLeft: 10,
        spacingRight: 10
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
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
          text: 'Registered clients'
        }
      },
      legend: {
        enabled: true
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> registered clients'
      },
      series: [{
        name: this.title,
        data: this.data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          crop: false,
          overflow: 'none',
          color: '#FFFFFF',
          align: 'top',
          format: '{point.y:.0f}',
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
