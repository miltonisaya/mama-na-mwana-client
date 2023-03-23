import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {map, startWith} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {NotifierService} from "../../../notifications/notifier.service";
import {OrganisationUnitService} from "../../../organisation-units/organisation-unit.service";
import {ContactsService} from "../../../contacts/contacts.service";

@Component({
  selector: 'app-report-params-dialog',
  templateUrl: 'report-params-dialog.html',
  styleUrls: ['report-params-dialog.sass'],
  providers: [ DatePipe ]
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

  constructor(
    private datePipe: DatePipe,
    private notifierService: NotifierService,
    private organisationUnitService: OrganisationUnitService,
    private contactService: ContactsService,
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
  }

  getCouncils() {
    let params = {
      pageSize: 1000
    };
    return this.organisationUnitService.getCouncils(params).subscribe((response: any) => {
      this.councils = response.data;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log(error);
    });
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.councils.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(council: any): string {
    this.selectedCouncil = council.id;
    return council && council.name ? council.name : '';
  }

  formatSelectedDates() {
    this.formattedStartDate= this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd');
    this.formattedEndDate = this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd');
  }

  generateReport(data: any) {
    //Format the date
    this.formatSelectedDates();
    let params = {
      format: "pdf",
      name: null,
      params: {
        // start_date: this.startDate.value.toISOString().slice(0,10),
        // end_date: this.startDate.value.toISOString().slice(0,10),
        start_date: this.formattedStartDate,
        end_date: this.formattedEndDate,
      }
    }

    if (this.myControl.value !== null && this.myControl.value !== undefined) {
      params.params['organisationUnitId'] = this.myControl.value.code;
    }

    let fileName;
    if (data.reportCode == 1) {
      params.name = "mnm-responses-by-age-and-facility-round-one"
    }

    if (data.reportCode == 2) {
      params.name = "mnm-responses-by-age-and-facility-round-two"
    }

    if (data.reportCode == 3) {
      params.name = "mnm-responses-by-age-and-facility-round-three"
    }

    if (data.reportCode == 4) {
      params.name = "mnm-responses-by-age-and-facility-round-four"
    }

    if (data.reportCode == 'N1') {
      params.name = "mnm-national-responses-by-age-groups-round-one"
    }

    if (data.reportCode == 'N2') {
      params.name = "mnm-national-responses-by-age-groups-round-two"
    }

    if (data.reportCode == 'N3') {
      params.name = "mnm-national-responses-by-age-groups-round-three"
    }

    if (data.reportCode == 'N4') {
      params.name = "mnm-national-responses-by-age-groups-round-four"
    }

    return this.contactService.responsesInAgeGroups(params).subscribe((response: any) => {
      const string = JSON.stringify(response);
      const result = JSON.parse(string);
      let base64String = result.data;

      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = params.name + ".pdf";
      link.click();
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }
}



