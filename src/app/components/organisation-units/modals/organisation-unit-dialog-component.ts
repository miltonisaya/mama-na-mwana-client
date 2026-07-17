import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {OrganisationUnitService} from '../organisation-unit.service';
import {UntypedFormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";

@Component({
    selector: 'app-organisation-unit-dialog',
    templateUrl: 'organisation-unit-dialog-component.html',
    styleUrls: ['organisation-unit-dialog.component.sass'],
    standalone: false
})

export class OrganisationUnitDialogComponent implements OnInit {
  myControl = new UntypedFormControl('');
  councils: any[] = [];
  filteredOptions: any;

  constructor(
    public organisationUnitService: OrganisationUnitService,
    public dialogRef: MatDialogRef<OrganisationUnitDialogComponent>,
    public notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (value?.name ?? '')),
        map(name => name ? this._filter(name) : this.councils.slice())
      );

    this.getCouncils();
  }

  displayFn = (council: any): string => {
    return council && council.name ? council.name : '';
  }

  getCouncils() {
    const params = {pageSize: 1000};
    const parentId = this.organisationUnitService.form.get('parentId').value;

    this.organisationUnitService.getCouncils(params).subscribe((response: any) => {
      this.councils = response.data || [];

      if (parentId) {
        const match = this.councils.find((c: any) => c.id === parentId);
        if (match) {
          this.myControl.setValue(match);
        } else {
          // Parent not in the standard list (e.g., region or deep-level council) — fetch directly
          this.organisationUnitService.getById(parentId).subscribe((res: any) => {
            const parent = res.data;
            if (parent) {
              this.myControl.setValue({id: parent.id, name: parent.name, code: parent.code});
            }
          });
        }
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  submitForm(data) {
    const councilValue = this.myControl.value;
    if (councilValue && typeof councilValue === 'object' && councilValue.id) {
      this.organisationUnitService.form.patchValue({parentId: councilValue.id});
    }
    console.log('Is valid =>', this.organisationUnitService.form.valid);

    if (this.organisationUnitService.form.valid) {
      if (this.organisationUnitService.form.get('id').value) {
        this.organisationUnitService.updateOrganisationUnit(this.organisationUnitService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.organisationUnitService.createOrganisationUnit(this.organisationUnitService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.organisationUnitService.form.reset();
    this.organisationUnitService.initializeFormGroup();
    this.dialogRef.close();
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.councils.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
