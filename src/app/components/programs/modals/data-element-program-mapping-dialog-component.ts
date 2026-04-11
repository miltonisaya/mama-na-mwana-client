import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {DataElementService} from '../../data-elements/dataElement.service';
import {PrimeNGConfig} from "primeng/api";
import {ProgramService} from "../program.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'data-element-program-mapping-dialog-component.html',
  styleUrls: ['data-element-program-mapping-dialog.component.sass']
})

export class DataElementProgramMappingDialogComponent implements OnInit {
  fetchedList: any[] = [];
  selectedDataElementsList: any[] = [];

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
    this.primengConfig.ripple = true;
    this.loadData();
  }

  loadData() {
    const allDataElements$ = this.dataElementService.getDataElements({pageSize: 1000});
    const program$ = this.programService.getProgramById(this.data);

    forkJoin([allDataElements$, program$]).subscribe({
      next: ([dataElementsResponse, programResponse]) => {
        const allElements: any[] = dataElementsResponse.data.content;
        const mappedElements: any[] = programResponse.data.dataElements ?? [];
        const mappedIds = new Set(mappedElements.map((e: any) => e.id));

        this.selectedDataElementsList = mappedElements;
        this.fetchedList = allElements.filter(e => !mappedIds.has(e.id));
      },
      error: (error) => {
        this.notifierService.showNotification(error.error?.error ?? 'Failed to load data', 'OK', 'error');
        console.error(error);
      }
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
