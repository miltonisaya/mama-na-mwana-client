import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {DataElementService} from '../../data-elements/dataElement.service';
import {PrimeNGConfig} from "primeng/api";
import {ProgramService} from "../program.service";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'data-element-program-mapping-dialog-component.html',
  styleUrls: ['data-element-program-mapping-dialog.component.sass']
})

export class DataElementProgramMappingDialogComponent implements OnInit {
  fetchedList: any[];
  selectedDataElementsList: any;

  constructor(
    public dialogRef: MatDialogRef<DataElementProgramMappingDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public programService: ProgramService,
    private primengConfig: PrimeNGConfig,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getDataElements();
    this.selectedDataElementsList = [];
    this.primengConfig.ripple = true;
  }

  getDataElements() {
    let params = {
      pageSize: 1000
    };
    return this.dataElementService.getDataElements(params).subscribe((response: any) => {
      this.fetchedList = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log(error);
    });
  }

  saveData() {
    let payload = {
      programId: this.data,
      dataElements: this.selectedDataElementsList
    }

    return this.programService.mapDataElements(payload).subscribe((response: any) => {
      response.data.content;
      console.log("Response=>", response);
      this.notifierService.showNotification(response.message.message, 'OK', 'success');
      this.matDialog.closeAll()
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log("Error =>", error);
      this.matDialog.closeAll()
    })
  }
}



