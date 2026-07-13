import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UntypedFormControl, Validators} from '@angular/forms';
import {NotifierService} from "../../../notifications/notifier.service";
import {OrganisationUnitService} from "../../../organisation-units/organisation-unit.service";
import {ReportService} from "../../report.service";

@Component({
  selector: 'app-report-params-dialog',
  templateUrl: 'report-params-dialog.html',
  styleUrls: ['report-params-dialog.sass']
})
export class ReportParamsDialog implements OnInit {
  myControl = new UntypedFormControl('');
  startDate = new UntypedFormControl('', [Validators.required]);
  endDate = new UntypedFormControl('', [Validators.required]);
  councils: any[] = [];
  params: any[] = [];
  selectedNode: any;
  isLoading = true;
  hasDateParams = false;
  hasOrgUnitParam = false;

  constructor(
    private NotifierService: NotifierService,
    private OrganisationUnitService: OrganisationUnitService,
    private ReportService: ReportService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getCouncils();
    this.getReportParams();
  }

  getReportParams() {
    this.selectedNode = this.data.selectedNode;
    this.isLoading = true;
    return this.ReportService.getParams(this.selectedNode.url).subscribe((response: any) => {
      this.params = response.data ?? [];
      this.hasDateParams = this.params.some((p: any) => p.name === 'start_date' || p.name === 'end_date');
      this.hasOrgUnitParam = this.params.some((p: any) => p.name === 'organisationUnitId');
      this.isLoading = false;
    }, error => {
      this.NotifierService.showNotification(error.error?.error ?? 'Failed to load report parameters', 'OK', 'error');
      this.isLoading = false;
    });
  }

  getCouncils() {
    return this.OrganisationUnitService.getCouncils({pageSize: 1000}).subscribe((response: any) => {
      this.councils = response.data;
    }, error => {
      this.NotifierService.showNotification(error.error?.error ?? 'Failed to load councils', 'OK', 'error');
    });
  }

  generateReport() {
    const reportParams: Record<string, any> = {};

    if (this.hasDateParams) {
      reportParams['start_date'] = this.startDate.value;
      reportParams['end_date'] = this.endDate.value;
    }

    if (this.hasOrgUnitParam && this.myControl.value) {
      reportParams['organisationUnitId'] = this.myControl.value;
    }

    const params = {
      format: 'pdf',
      name: this.selectedNode.url,
      params: reportParams
    };

    return this.ReportService.generateReport(params).subscribe((response: any) => {
      const base64String = JSON.parse(JSON.stringify(response)).data;
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${base64String}`;
      link.download = params.name + '.pdf';
      link.click();
    }, error => {
      this.NotifierService.showNotification(error.error?.error ?? 'Failed to generate report', 'OK', 'error');
    });
  }
}
