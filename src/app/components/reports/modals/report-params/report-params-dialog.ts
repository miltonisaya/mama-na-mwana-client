import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {map, startWith} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {NotifierService} from "../../../notifications/notifier.service";
import {OrganisationUnitService} from "../../../organisation-units/organisation-unit.service";
import {ReportService} from "../../report.service";

@Component({
  selector: 'app-report-params-dialog',
  templateUrl: 'report-params-dialog.html',
  styleUrls: ['report-params-dialog.sass'],
  providers: [DatePipe]
})

export class ReportParamsDialog implements OnInit {
  myControl = new FormControl([Validators.required]);
  startDate = new FormControl([Validators.required]);
  endDate = new FormControl([Validators.required]);
  councils: any;
  filteredOptions: any;
  selectedCouncil: any;
  formattedStartDate: any;
  formattedEndDate: any;
  params: any;
  selectedNode: any;

  constructor(
    private DatePipe: DatePipe,
    private NotifierService: NotifierService,
    private OrganisationUnitService: OrganisationUnitService,
    private ReportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getCouncils();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.councils)
      );

    this.getReportParams();
  }

  getReportParams() {
    this.selectedNode = this.data.data.selectedNode;
    console.log("selectedNode ->", this.selectedNode);
    return this.ReportService.getParams(this.selectedNode.url).subscribe((response: any) => {
      this.params = response.data;
    }, error => {
      this.NotifierService.showNotification(error.error.error, 'OK', 'error');
    })
  }

  getCouncils() {
    let params = {
      pageSize: 1000
    };
    return this.OrganisationUnitService.getCouncils(params).subscribe((response: any) => {
      this.councils = response.data;
    }, error => {
      this.NotifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  displayFn(council: any): string {
    this.selectedCouncil = council.id;
    return council && council.name ? council.name : '';
  }

  formatSelectedDates() {
    this.formattedStartDate = this.DatePipe.transform(this.startDate.value, 'yyyy-MM-dd');
    this.formattedEndDate = this.DatePipe.transform(this.endDate.value, 'yyyy-MM-dd');
  }

  generateReport() {
    //Format the date
    this.formatSelectedDates();
    let params = {};
    params['format'] = "pdf";
    params['name'] = this.data.data.selectedNode.url;
    if(this.params != null){
      params['params'] = {
        start_date: this.formattedStartDate,
        end_date: this.formattedEndDate,
      };
    }

    if (this.myControl.value !== null && this.myControl.value !== undefined) {
      params['params']['organisationUnitId'] = this.myControl.value.code;
    }

    return this.ReportService.generateReport(params).subscribe((response: any) => {
      const string = JSON.stringify(response);
      const result = JSON.parse(string);
      let base64String = result.data;

      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = params['name'] + ".pdf";
      link.click();
    }, error => {
      this.NotifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.councils.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}



