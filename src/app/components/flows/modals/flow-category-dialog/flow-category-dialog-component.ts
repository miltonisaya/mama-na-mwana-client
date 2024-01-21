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
  dataElementsYes: any;
  dataElementsNo: any;
  filteredOptionsYes: any;
  filteredOptionsNo: any;
  selectedDataElement: any;
  autoFilter: any;

  myControl = new FormControl();

  constructor(
    public flowKeyService: FlowKeyService,
    public dialogRef: MatDialogRef<FlowCategoryDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElementsYes();
    this.getDataElementsNo();

    this.filteredOptionsYes = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataElementsYes)
      );

    this.filteredOptionsNo = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataElementsNo)
      );
  }

  getDataElementsYes() {
    let params = {
      pageSize: 1000
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.dataElementsYes = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getDataElementsNo() {
    let params = {
      pageSize: 1000
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.dataElementsNo = response.data.content;
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

  mapDataElement() {
    let data = {
      dataElementId: this.myControl.value.id,
      rapidProFlowKeyId: this.data.id
    };

    this.flowKeyService.mapDataElement(data).subscribe((response: any) => {
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
    this.dialogRef.close();
  }

  displayFn(dataElement: any): string {
    this.selectedDataElement = dataElement.id;
    return dataElement && dataElement.name ? dataElement.name : '';
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.dataElementsYes.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  // private _filter(name: string): any {
  //   const filterValue = name.toLowerCase();
  //   return this.dataElementsNo.filter(option => option.name.toLowerCase().includes(filterValue));
  // }
}

