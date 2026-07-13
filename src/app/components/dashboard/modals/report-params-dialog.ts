import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {UntypedFormControl, Validators} from '@angular/forms';
import {OrganisationUnitService} from "../../organisation-units/organisation-unit.service";
import {ContactsService} from "../../contacts/contacts.service";

@Component({
  selector: 'app-dashboard-report-params-dialog',
  templateUrl: 'report-params-dialog.html',
  styleUrls: ['report-params-dialog.sass']
})
export class ReportParamsDialog implements OnInit {
  myControl = new UntypedFormControl('');
  startDate = new UntypedFormControl('', [Validators.required]);
  endDate = new UntypedFormControl('', [Validators.required]);
  councils: any[] = [];

  constructor(
    private notifierService: NotifierService,
    private organisationUnitService: OrganisationUnitService,
    private contactService: ContactsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data?.isNational === false) {
      this.getCouncils();
    }
  }

  getCouncils() {
    return this.organisationUnitService.getCouncils({pageSize: 1000}).subscribe((response: any) => {
      this.councils = response.data;
    }, error => {
      this.notifierService.showNotification(error.error?.error ?? 'Failed to load councils', 'OK', 'error');
    });
  }

  generateReport(data: any) {
    const reportNameMap: Record<string | number, string> = {
      1: 'mnm-responses-by-age-and-facility-round-one',
      2: 'mnm-responses-by-age-and-facility-round-two',
      3: 'mnm-responses-by-age-and-facility-round-three',
      4: 'mnm-responses-by-age-and-facility-round-four',
      'N1': 'mnm-national-responses-by-age-groups-round-one',
      'N2': 'mnm-national-responses-by-age-groups-round-two',
      'N3': 'mnm-national-responses-by-age-groups-round-three',
      'N4': 'mnm-national-responses-by-age-groups-round-four',
    };

    const reportName = reportNameMap[data.reportCode];
    if (!reportName) {
      this.notifierService.showNotification('Unknown report code', 'OK', 'error');
      return;
    }

    const params: any = {
      format: 'pdf',
      name: reportName,
      params: {
        start_date: this.startDate.value,
        end_date: this.endDate.value,
      }
    };

    if (this.myControl.value) {
      params.params['organisationUnitId'] = this.myControl.value;
    }

    return this.contactService.responsesInAgeGroups(params).subscribe((response: any) => {
      const base64String = JSON.parse(JSON.stringify(response)).data;
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${base64String}`;
      link.download = reportName + '.pdf';
      link.click();
    }, error => {
      this.notifierService.showNotification(error.error?.error ?? 'Failed to generate report', 'OK', 'error');
    });
  }
}
