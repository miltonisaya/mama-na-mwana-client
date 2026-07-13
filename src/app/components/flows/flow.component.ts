import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {FlowService} from './flow.service';
import {NotifierService} from '../notifications/notifier.service';
import {FlowKeyDialogComponent} from './modals/flow-key-dialog/flow-key-dialog-component';
import {FlowCategoryDialogComponent} from './modals/flow-category-dialog/flow-category-dialog-component';
import {PossibleTrueValuesComponent} from './modals/possible-true-values-dialog/possible-true-values-component';
import {userCan} from '../../helpers/user-can';

@Component({
  selector: 'app-flows',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;
  flows: any[] = [];
  selectedFlowId: any = null;
  filterText = '';

  displayedColumns: string[] = ['sno', 'keyName', 'categories', 'dataElement', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('resetDialog') resetDialog: TemplateRef<any>;

  private keyToReset: any = null;

  constructor(
    private flowService: FlowService,
    private notifierService: NotifierService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFlows();
  }

  getFlows(): void {
    this.flowService.getFlows({pageSize: 1000}).subscribe({
      next: (response: any) => {
        this.flows = response?.data?.content ?? [];
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Failed to load flows', 'OK', 'error');
      }
    });
  }

  syncFlows(): void {
    this.flowService.syncFlows().subscribe({
      next: (response: any) => {
        this.notifierService.showNotification(response?.message ?? 'Sync complete', 'OK', 'success');
        this.getFlows();
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Sync failed', 'OK', 'error');
      }
    });
  }

  onFlowSelected(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedFlowId = value || null;
    if (this.selectedFlowId) {
      this.loadKeys();
    } else {
      this.dataSource.data = [];
    }
  }

  applyFilter(event: Event): void {
    this.filterText = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.filterText;
  }

  getCategories(element: any): any[] {
    return element?.categories ?? [];
  }

  splitValues(possibleTrueValues: string): string[] {
    if (!possibleTrueValues) return [];
    return possibleTrueValues.split(',').map(v => v.trim()).filter(Boolean);
  }

  openMapDataElementDialog(element: any): void {
    if (!element) return;
    this.dialog.open(FlowKeyDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        id: element.id,
        keyDescription: element.keyDescription,
        keyName: element.keyName,
        flowId: this.selectedFlowId,
      }
    }).afterClosed().subscribe(() => this.loadKeys());
  }

  openMapCategoryDialog(category: any): void {
    if (!category) return;
    this.dialog.open(FlowCategoryDialogComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        id: category.id,
        dataElementId: category.dataElementId,
        flowId: this.selectedFlowId,
        categoryName: category.name,
      }
    }).afterClosed().subscribe(() => this.loadKeys());
  }

  openSetPossibleValuesDialog(category: any): void {
    if (!category) return;
    this.dialog.open(PossibleTrueValuesComponent, {
      disableClose: true,
      autoFocus: true,
      width: '500px',
      data: {possibleTrueValues: category}
    }).afterClosed().subscribe(() => this.loadKeys());
  }

  openResetDialog(element: any): void {
    this.keyToReset = element;
    this.dialog.open(this.resetDialog).afterClosed().subscribe(() => {});
  }

  confirmReset(): void {
    if (!this.keyToReset) return;
    const id = this.keyToReset.id;
    this.dialog.closeAll();
    this.flowService.resetMapping(id).subscribe({
      next: (response: any) => {
        this.notifierService.showNotification(response?.message ?? 'Reset successful', 'OK', 'success');
        this.loadKeys();
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Reset failed', 'OK', 'error');
      }
    });
  }

  private loadKeys(): void {
    if (!this.selectedFlowId) return;
    this.flowService.getKeysByFlowId(this.selectedFlowId).subscribe({
      next: (response: any) => {
        this.dataSource.data = response?.data ?? [];
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.filterText) {
          this.dataSource.filter = this.filterText;
        }
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Failed to load keys', 'OK', 'error');
      }
    });
  }
}
