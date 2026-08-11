import {Component, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {RunsService} from './runs.service';
import {FlowService} from '../flows/flow.service';
import {NotifierService} from '../notifications/notifier.service';
import {RunResponsesDialogComponent} from './modals/run-responses-dialog/run-responses-dialog.component';
import {userCan} from '../../helpers/user-can';

@Component({
    selector: 'app-runs',
    templateUrl: './runs.component.html',
    styleUrls: ['./runs.component.scss'],
    standalone: false
})
export class RunsComponent implements OnInit {
  // Exposed so the template can call userCan('AUTHORITY_NAME') directly.
  readonly userCan = userCan;

  displayedColumns: string[] = ['sno', 'flow', 'contact', 'status', 'startedOn', 'exitedOn', 'actions'];
  runs: any = [];
  dataSource;
  pageSize = 10;
  pageNo = 0;
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  syncing = false;

  // Flow filter — same autocomplete pattern as the Manage Flows page.
  flows: any[] = [];
  selectedFlowId: string | null = null;
  flowControl = new UntypedFormControl();
  filteredFlows!: Observable<any[]>;

  // Status filter — colors mirror the .status-chip-- classes used in the table.
  selectedStatus = '';
  statusOptions = [
    {value: 'active', label: 'Active', dotClass: 'status-dot--active'},
    {value: 'completed', label: 'Completed', dotClass: 'status-dot--completed'},
    {value: 'interrupted', label: 'Interrupted', dotClass: 'status-dot--interrupted'},
    {value: 'expired', label: 'Expired', dotClass: 'status-dot--expired'},
    {value: 'failed', label: 'Failed', dotClass: 'status-dot--failed'},
  ];

  // Date range filter, each an outlined mat-form-field (matches the flow
  // field's vocabulary/height so the whole toolbar sits on one baseline).
  startDate = '';
  endDate = '';

  constructor(
    private runsService: RunsService,
    private flowService: FlowService,
    private notifierService: NotifierService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.loadFlows();
    this.getRuns();
  }

  loadFlows(): void {
    this.flowService.getFlows({pageSize: 1000}).subscribe({
      next: (response: any) => {
        this.flows = response?.data?.content ?? [];
        this.filteredFlows = this.flowControl.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : value?.name)),
          map(name => name ? this._filterFlows(name) : this.flows.slice())
        );
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Failed to load flows', 'OK', 'error');
      }
    });
  }

  getRuns(): void {
    const params: any = {pageNo: this.pageNo, pageSize: this.pageSize, sortBy: 'startedOn', sortDirection: 'desc'};
    if (this.selectedFlowId) {
      params.flowId = this.selectedFlowId;
    }
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }
    if (this.startDate) {
      params.startDate = this.startDate;
    }
    if (this.endDate) {
      params.endDate = this.endDate;
    }
    this.runsService.getRuns(params).subscribe({
      next: (response: any) => {
        this.runs = response?.data ?? {};
        this.dataSource = new MatTableDataSource<any>(this.runs?.content ?? []);
      },
      error: (err) => {
        this.notifierService.showNotification(err?.error?.error ?? 'Failed to load runs', 'OK', 'error');
      }
    });
  }

  onFlowSelected(event: MatAutocompleteSelectedEvent): void {
    const flow = event.option.value;
    this.selectedFlowId = flow?.id ?? null;
    this.pageNo = 0;
    this.getRuns();
  }

  clearFlowSelection(): void {
    this.flowControl.setValue('');
    this.selectedFlowId = null;
    this.pageNo = 0;
    this.getRuns();
  }

  displayFlow(flow: any): string {
    return flow?.name ?? '';
  }

  private _filterFlows(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.flows.filter(f => f.name.toLowerCase().includes(filterValue));
  }

  onStatusFilterChange(): void {
    this.pageNo = 0;
    this.getRuns();
  }

  onDateFilterChange(): void {
    this.pageNo = 0;
    this.getRuns();
  }

  clearDateFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.pageNo = 0;
    this.getRuns();
  }

  syncRuns(): void {
    this.syncing = true;
    this.runsService.syncRuns().subscribe({
      next: (response: any) => {
        this.syncing = false;
        this.notifierService.showNotification(response?.message ?? 'Sync complete', 'OK', 'success');
        this.getRuns();
      },
      error: (err) => {
        this.syncing = false;
        this.notifierService.showNotification(err?.error?.error ?? 'Sync failed', 'OK', 'error');
      }
    });
  }

  viewResponses(run: any): void {
    this.dialog.open(RunResponsesDialogComponent, {
      autoFocus: false,
      data: {run}
    });
  }

  statusClass(status: string): string {
    switch ((status ?? '').toLowerCase()) {
      case 'completed': return 'status-chip status-chip--completed';
      case 'active': return 'status-chip status-chip--active';
      case 'interrupted': return 'status-chip status-chip--interrupted';
      case 'expired': return 'status-chip status-chip--expired';
      case 'failed': return 'status-chip status-chip--failed';
      default: return 'status-chip';
    }
  }

  get totalElements(): number { return this.runs?.totalElements ?? 0; }

  pageRangeEnd(): number {
    return Math.min((this.pageNo + 1) * this.pageSize, this.totalElements);
  }

  firstPage() { this.pageNo = 0; this.getRuns(); }
  prevPage()  { this.pageNo--; this.getRuns(); }
  nextPage()  { this.pageNo++; this.getRuns(); }
  lastPage()  { this.pageNo = Math.ceil(this.totalElements / this.pageSize) - 1; this.getRuns(); }

  pageSizeChanged(e: any) {
    this.pageSize = +e.target.value;
    this.pageNo = 0;
    this.getRuns();
  }
}
