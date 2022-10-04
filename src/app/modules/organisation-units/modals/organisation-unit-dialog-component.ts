import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {OrganisationUnitService} from '../organisation-unit.service';

@Component({
  selector: 'app-organisation-unit-dialog',
  templateUrl: 'organisation-unit-dialog-component.html',
  styleUrls: ['organisation-unit-dialog.component.sass']
})

export class OrganisationUnitDialogComponent implements OnInit {
  constructor(
    public OrganisationUnitService: OrganisationUnitService,
    public dialogRef: MatDialogRef<OrganisationUnitDialogComponent>,
    public notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.OrganisationUnitService.form.valid) {
      if (this.OrganisationUnitService.form.get('id').value) {
        this.OrganisationUnitService.updateOrganisationUnit(this.OrganisationUnitService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          });
      } else {
        this.OrganisationUnitService.createOrganisationUnit(this.OrganisationUnitService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.error.error,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.OrganisationUnitService.form.reset();
    this.OrganisationUnitService.initializeFormGroup();
    this.dialogRef.close();
  }
}
