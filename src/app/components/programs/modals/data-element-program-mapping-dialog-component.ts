import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {DataElementService} from '../../data-elements/dataElement.service';
import {FormControl} from '@angular/forms';
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'data-element-program-mapping-dialog-component.html',
  styleUrls: ['data-element-program-mapping-dialog.component.sass']
})

export class DataElementProgramMappingDialogComponent implements OnInit {
  list1: any[];
  myList: any;
  myControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<DataElementProgramMappingDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    private primengConfig: PrimeNGConfig,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();
    this.myList = [];
    this.primengConfig.ripple = true;
  }

  getDataElements() {
    let params = {
      pageSize: 1000
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.list1 = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error,'OK', 'error');
      console.log(error);
    });
  }

  saveData() {
    console.log(this.myList)
  }
}



