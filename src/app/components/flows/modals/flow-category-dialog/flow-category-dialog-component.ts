import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {FlowKeyService} from "../../flowkey.service";
import {NotifierService} from "../../../notifications/notifier.service";
import {DataElementService} from "../../../data-elements/dataElement.service";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'flow-category-dialog-component.html',
  styleUrls: ['flow-category-dialog.component.sass']
})

export class FlowCategoryDialogComponent implements OnInit {
  dataElements: any;
  filteredOptions: any;
  selectedDataElementYes: any;

  dataElement = new FormControl();

  constructor(
    public flowKeyService: FlowKeyService,
    public dialogRef: MatDialogRef<FlowCategoryDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();
    this.filteredOptions = this.dataElement.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataElements)
      );
  }

  getDataElements() {
    let params = {
      pageSize: 1000
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.dataElements = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  submitForm(data) {
    if (this.flowKeyService.form.valid) {
      this.flowKeyService.updateFlowKey(this.flowKeyService.form.value)
        .subscribe(response => {
          this.notifierService.showNotification(response.message, 'OK', 'success');
          this.onClose();
        }, error => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
        });
    }
  }

  onClose() {
    this.flowKeyService.form.reset();
    this.flowKeyService.initializeFormGroup();
    this.dialogRef.close();
  }

  mapCategoryAndDataElement() {
    let data = {
      dataElementId: this.dataElement.value.id,
      categoryId: this.data.id
    };

    console.log("Mapping data ->",data);

    this.flowKeyService.mapDataElementsWithCategory(data).subscribe((response: any) => {
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
    this.dialogRef.close();
  }

  displayFn(dataElement: any): string {
    this.selectedDataElementYes = dataElement.id;
    return dataElement && dataElement.name ? dataElement.name : '';
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.dataElements.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}

