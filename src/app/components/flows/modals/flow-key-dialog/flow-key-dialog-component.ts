import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../../notifications/notifier.service';
import {FlowKeyService} from '../../flowkey.service';
import {DataElementService} from '../../../data-elements/dataElement.service';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {FlowService} from "../../flow.service";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'flow-key-dialog-component.html',
  styleUrls: ['flow-key-dialog.component.sass']
})

export class FlowKeyDialogComponent implements OnInit {
  dataElements: any;
  filteredOptions: any;
  selectedDataElement: any;
  autoFilter: any;

  myControl = new FormControl();

  constructor(
    public flowKeyService: FlowKeyService,
    public dialogRef: MatDialogRef<FlowKeyDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public flowService: FlowService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();

    this.filteredOptions = this.myControl.valueChanges
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

  mapDataElement() {
    let data = {
      dataElementId: this.myControl.value.id,
      rapidProFlowKeyId: this.data.id
    };

    this.flowKeyService.mapDataElement(data).subscribe((response: any) => {
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.flowService.getKeysByFlowId(this.data.flowId);
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      this.flowService.getKeysByFlowId(this.data.flowId);
    });
    this.dialogRef.close();
  }

  displayFn(dataElement: any): string {
    this.selectedDataElement = dataElement.id;
    return dataElement && dataElement.name ? dataElement.name : '';
  }

  private _filter(name: string): any {
    const filterValue = name.toLowerCase();
    return this.dataElements.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}

