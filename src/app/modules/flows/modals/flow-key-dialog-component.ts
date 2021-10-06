import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {FlowKeyService} from '../flowkey.service';
import {DataElementService} from '../../data-elements/dataElement.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'flow-key-dialog-component.html',
  styleUrls: ['flow-key-dialog.component.sass']
})

export class FlowKeyDialogComponent implements OnInit {
  dataElements : any;
  filteredOptions: any;
  options: any;
  selectedDataElement: any;
  dataElementControl = new FormControl();

  constructor(
    public flowKeyService: FlowKeyService,
    public dialogRef: MatDialogRef<FlowKeyDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService
  ) { }

  ngOnInit() {
    this.getDataElements();
  }

  getDataElements(){
    let params = {
      pageSize : 1000
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.dataElements = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  submitForm(data) {
    if (this.flowKeyService.form.valid) {
      this.flowKeyService.updateFlowKey(this.flowKeyService.form.value)
        .subscribe(response => {
          this.notifierService.showNotification(response.message,'OK', 'success');
          this.onClose();
        });
    }
  }

  onClose() {
    this.flowKeyService.form.reset();
    this.flowKeyService.initializeFormGroup();
    this.dialogRef.close();
  }
}
