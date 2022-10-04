import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotifierService} from '../notifications/notifier.service';
import {FlowService} from './flow.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FlowKeyDialogComponent} from './modals/flow-key-dialog-component';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('resetDialog') resetDialog: TemplateRef<any>;
  displayedColumns: string[] = ["sno",'keyName', 'keyDescription','dataElement', 'actions'];
  dataSource: MatTableDataSource<any>;
  input: any;


  constructor(
    private FlowService: FlowService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getFlows();
  }

  /**
   * This method returns flows
   */
  getFlows() {
    let params = {
      pageSize : 1000
    };
    return this.FlowService.getFlows(params).subscribe((response: any) => {
      this.flows = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  syncFlows() {
    return this.FlowService.syncFlows().subscribe((response: any) => {
      this.getFlows();
      if(response.status == '200'){
        this.notifierService.showNotification(response.message,'OK','success');
      }
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getKeys(event: any) {
    let id = event.value;
    return this.FlowService.getKeysByFlowId(id).subscribe((response: any) => {
      this.flowKeys = response.data;
      this.dataSource = new MatTableDataSource<any>(this.flowKeys);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    })
  }

  openMapDataElementDialog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (data) {
      const flowKeysData = {
        id: data.id,
        keyDescription: data.keyDescription,
        keyName: data.keyName,
      };

      this.dialog.open(FlowKeyDialogComponent, {data: flowKeysData})
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

  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openResetDialog(data) {
    this.elementId = data.id;
    this.dialog.open(this.resetDialog)
      .afterClosed().subscribe(() => {
    });
  }

  reset(id: String) {
    return this.FlowService.resetMapping(this.elementId).subscribe((response: any) => {
      this.flowKeys = response.data;
      this.dataSource = new MatTableDataSource<any>(this.flowKeys);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    })
  }
}
