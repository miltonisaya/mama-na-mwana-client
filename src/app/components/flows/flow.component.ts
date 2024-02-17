import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotifierService} from '../notifications/notifier.service';
import {FlowService} from './flow.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FlowKeyDialogComponent} from './modals/flow-key-dialog/flow-key-dialog-component';
import {FlowCategoryDialogComponent} from "./modals/flow-category-dialog/flow-category-dialog-component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})

export class FlowComponent implements OnInit {
  flows: any = [];
  elementId: any;
  selectedFlowId: any = null;
  flowKeys: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('resetDialog') resetDialog: TemplateRef<any>;
  displayedColumns: string[] = ["sno", 'keyName', 'categories', 'dataElement', 'actions'];
  dataSource: MatTableDataSource<any>;
  input: any;

  constructor(
    private flowService: FlowService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getFlows();
  }

  /**
   * This method returns flows
   */
  getFlows() {
    let params = {
      pageSize: 1000
    };
    return this.flowService.getFlows(params).subscribe((response: any) => {
      this.flows = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  syncFlows(): Subscription {
    return this.flowService.syncFlows().subscribe((response: any) => {
      this.getFlows();
      if (response.status == '200') {
        this.notifierService.showNotification(response.message, 'OK', 'success');
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getKeys(event: any) {
    let id = event.value;
    return this.flowService.getKeysByFlowId(id).subscribe((response: any) => {
      this.flowKeys = response.data;
      this.dataSource = new MatTableDataSource<any>(this.flowKeys);
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    })
  }

  openMapDataElementDialog(data): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const categoriesMappingData = {
        id: data.id,
        keyDescription: data.keyDescription,
        keyName: data.keyName,
        flowId: this.selectedFlowId,
      };

      this.dialog.open(FlowKeyDialogComponent, {data: categoriesMappingData})
        .afterClosed().subscribe(() => {
        this.getFlows();
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(FlowKeyDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getFlows();
      });
    }
  }

  openMapCategoryDialog(data): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const categoriesMappingData = {
        id: data.id,
        dataElementId: data.dataElementId,
        flowId: this.selectedFlowId,
        categoryName: data.name
      };

      this.dialog.open(FlowCategoryDialogComponent, {data: categoriesMappingData})
        .afterClosed().subscribe(() => {
        /**
         * Fetch the data using the flow id
         */
        return this.flowService.getKeysByFlowId(this.selectedFlowId).subscribe((response: any) => {
          this.flowKeys = response.data;
          this.dataSource = new MatTableDataSource<any>(this.flowKeys);
          this.dataSource.sort = this.sort;
        }, error => {
          this.notifierService.showNotification(error.error.error, 'OK', 'error');
        });
      });
    } else {
      dialogConfig.data = {};
      this.dialog.open(FlowCategoryDialogComponent, dialogConfig)
        .afterClosed().subscribe(() => {
        this.getFlows();
      });
    }
  }

  applyFilter(any: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openResetDialog(data): void {
    this.elementId = data.id;
    this.dialog.open(this.resetDialog)
      .afterClosed().subscribe(() => {
      this.dialog.closeAll();
    });
  }

  reset(): any {
    this.flowService.resetMapping(this.elementId).subscribe(response => {
      this.notifierService.showNotification(response.message, 'OK', 'success');

      /**
       * Fetch the data using the flow id
       */
      return this.flowService.getKeysByFlowId(this.selectedFlowId).subscribe((response: any) => {
        this.flowKeys = response.data;
        this.dataSource = new MatTableDataSource<any>(this.flowKeys);
        this.dataSource.sort = this.sort;
      }, error => {
        this.notifierService.showNotification(error.error.error, 'OK', 'error');
      });
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
      console.log(error);
    });
    this.dialog.closeAll();
  }
}
