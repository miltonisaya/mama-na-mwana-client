import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {OrganisationUnitService} from '../organisation-unit.service';
import {FormControl, Validators} from "@angular/forms";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-organisation-unit-dialog',
  templateUrl: 'organisation-unit-dialog-component.html',
  styleUrls: ['organisation-unit-dialog.component.sass']
})

export class OrganisationUnitDialogComponent implements OnInit {
  myControl = new FormControl([Validators.required]);
  councils: any;
  selectedCouncil: any;
  filteredOptions: any;

  constructor(
    public OrganisationUnitService: OrganisationUnitService,
    public dialogRef: MatDialogRef<OrganisationUnitDialogComponent>,
    public notifierService: NotifierService
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

  displayFn(council: any): string {
    this.selectedCouncil = council.id;
    return council && council.name ? council.name : '';
  }

  getCouncils() {
    let params = {
      pageSize: 1000
    };
    return this.OrganisationUnitService.getCouncils(params).subscribe((response: any) => {
      this.councils = response.data;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log(error);
    });
  }

  submitForm(data) {
    this.OrganisationUnitService.form.patchValue({parentId: this.myControl.value.id})
    console.log('Is valid =>', this.OrganisationUnitService.form.valid);

    if (this.OrganisationUnitService.form.valid) {
      if (this.OrganisationUnitService.form.get('id').value) {
        this.OrganisationUnitService.updateOrganisationUnit(this.OrganisationUnitService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.OrganisationUnitService.createOrganisationUnit(this.OrganisationUnitService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.OrganisationUnitService.form.reset();
    this.OrganisationUnitService.initializeFormGroup();
    this.dialogRef.close();
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.councils.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
