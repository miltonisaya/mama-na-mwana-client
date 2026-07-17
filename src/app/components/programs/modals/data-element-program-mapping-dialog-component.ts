import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {DataElementService} from '../../data-elements/dataElement.service';
import {ProgramService} from "../program.service";
import {forkJoin} from "rxjs";

@Component({
    selector: 'app-flow-key-dialog',
    templateUrl: 'data-element-program-mapping-dialog-component.html',
    styleUrls: ['data-element-program-mapping-dialog.component.sass'],
    standalone: false
})
export class DataElementProgramMappingDialogComponent implements OnInit {
  available: any[] = [];
  assigned: any[] = [];

  availableSelection = new Set<string>();
  assignedSelection = new Set<string>();

  availableSearch = '';
  assignedSearch = '';

  saving = false;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<DataElementProgramMappingDialogComponent>,
    public notifierService: NotifierService,
    public dataElementService: DataElementService,
    public programService: ProgramService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const allDataElements$ = this.dataElementService.getDataElements({pageSize: 1000});
    const program$ = this.programService.getProgramById(this.data);

    forkJoin([allDataElements$, program$]).subscribe({
      next: ([dataElementsResponse, programResponse]) => {
        const allElements: any[] = dataElementsResponse.data.content;
        const mappedElements: any[] = programResponse.data.dataElements ?? [];
        const mappedIds = new Set(mappedElements.map((e: any) => e.id));

        this.assigned = mappedElements;
        this.available = allElements.filter(e => !mappedIds.has(e.id));
        this.loading = false;
      },
      error: (error) => {
        this.notifierService.showNotification(error.error?.error ?? 'Failed to load data', 'OK', 'error');
        this.loading = false;
      }
    });
  }

  get filteredAvailable(): any[] {
    const q = this.availableSearch.toLowerCase().trim();
    return q ? this.available.filter(a => a.name.toLowerCase().includes(q)) : this.available;
  }

  get filteredAssigned(): any[] {
    const q = this.assignedSearch.toLowerCase().trim();
    return q ? this.assigned.filter(a => a.name.toLowerCase().includes(q)) : this.assigned;
  }

  toggleAvailable(id: string) {
    this.availableSelection.has(id) ? this.availableSelection.delete(id) : this.availableSelection.add(id);
  }

  toggleAssigned(id: string) {
    this.assignedSelection.has(id) ? this.assignedSelection.delete(id) : this.assignedSelection.add(id);
  }

  isAllAvailableSelected(): boolean {
    const filtered = this.filteredAvailable;
    return filtered.length > 0 && filtered.every(a => this.availableSelection.has(a.id));
  }

  isSomeAvailableSelected(): boolean {
    return this.availableSelection.size > 0 && !this.isAllAvailableSelected();
  }

  toggleAllAvailable() {
    if (this.isAllAvailableSelected()) {
      this.filteredAvailable.forEach(a => this.availableSelection.delete(a.id));
    } else {
      this.filteredAvailable.forEach(a => this.availableSelection.add(a.id));
    }
  }

  isAllAssignedSelected(): boolean {
    const filtered = this.filteredAssigned;
    return filtered.length > 0 && filtered.every(a => this.assignedSelection.has(a.id));
  }

  isSomeAssignedSelected(): boolean {
    return this.assignedSelection.size > 0 && !this.isAllAssignedSelected();
  }

  toggleAllAssigned() {
    if (this.isAllAssignedSelected()) {
      this.filteredAssigned.forEach(a => this.assignedSelection.delete(a.id));
    } else {
      this.filteredAssigned.forEach(a => this.assignedSelection.add(a.id));
    }
  }

  assign() {
    const toMove = this.available.filter(a => this.availableSelection.has(a.id));
    this.assigned = [...this.assigned, ...toMove];
    this.available = this.available.filter(a => !this.availableSelection.has(a.id));
    this.availableSelection.clear();
  }

  unassign() {
    const toMove = this.assigned.filter(a => this.assignedSelection.has(a.id));
    this.available = [...this.available, ...toMove];
    this.assigned = this.assigned.filter(a => !this.assignedSelection.has(a.id));
    this.assignedSelection.clear();
  }

  saveData() {
    this.saving = true;
    const payload = {
      programId: this.data,
      dataElements: this.assigned
    };

    this.programService.mapDataElements(payload).subscribe(
      (response: any) => {
        this.notifierService.showNotification(response.message.message, 'OK', 'success');
        this.matDialog.closeAll();
      },
      error => {
        this.notifierService.showNotification(error.error?.error ?? 'Failed to save', 'OK', 'error');
        this.saving = false;
      }
    );
  }
}
