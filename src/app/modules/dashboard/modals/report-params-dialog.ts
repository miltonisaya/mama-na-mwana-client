import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {FormControl} from '@angular/forms';
import {OrganisationUnitService} from "../../organisation-units/organisation-unit.service";
import {map, startWith} from "rxjs/operators";
import {ContactsService} from "../../contacts/contacts.service";

@Component({
  selector: 'app-report-params-dialog',
  templateUrl: 'report-params-dialog.html',
  styleUrls: ['report-params-dialog.sass']
})

export class ReportParamsDialog implements OnInit {
  myControl = new FormControl();
  councils: any;
  filteredOptions: any;
  selectedCouncil: any;
  constructor(
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

  generateReport(round: any) {
    let fileName;
    if (round == 1) {
      fileName = "mnm-responses-by-age-and-facility-round-one"
    }

    if (round == 2) {
      fileName = "mnm-responses-by-age-and-facility-round-two"
    }

    if (round == 3) {
      fileName = "mnm-responses-by-age-and-facility-round-three"
    }

    if (round == 4) {
      fileName = "mnm-responses-by-age-and-facility-round-four"
    }

    let params = {
      format: "pdf",
      name: fileName,
      params: {
        organisationUnitId: this.myControl.value.code
      }
    }

    return this.contactService.responsesInAgeGroups(params).subscribe((response: any) => {
      const string = JSON.stringify(response);
      const result = JSON.parse(string);
      let base64String = result.data;

      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = fileName+".pdf";
      link.click();
      // this.NotifierService.showNotification(response.message,'OK','success');
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log(error);
    });
  }
}



