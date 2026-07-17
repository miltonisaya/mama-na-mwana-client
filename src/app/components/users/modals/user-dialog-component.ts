import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {UsersService} from '../users.service';
import {RolesService} from '../../roles/roles.service';

@Component({
    selector: 'app-user-dialog',
    templateUrl: 'user-dialog-component.html',
    styleUrls: ['user-dialog.component.sass'],
    standalone: false
})

export class UserDialogComponent implements OnInit {
  available: any[] = [];
  assigned: any[] = [];

  availableSelection = new Set<string>();
  assignedSelection = new Set<string>();

  availableSearch = '';
  assignedSearch = '';

  loading = true;

  constructor(
    public UserService: UsersService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public NotifierService: NotifierService,
    public RoleService: RolesService
  ) {
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    // Fetch every role rather than relying on the backend's paginated default
    // (10) — this dialog needs the full set to split into available/assigned,
    // same approach as the Program ↔ DataElement mapping dialog.
    this.RoleService.getRoles({pageSize: 1000}).subscribe((response: any) => {
      const allRoles: any[] = response.data.content;
      const assignedRoles: any[] = this.UserService.form.get('roles').value ?? [];
      const assignedIds = new Set(assignedRoles.map((r: any) => r.id));

      this.assigned = assignedRoles;
      this.available = allRoles.filter(r => !assignedIds.has(r.id));
      this.loading = false;
    }, error => {
      this.NotifierService.showNotification(error.error.error, 'OK', 'error');
      this.loading = false;
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

  submitForm(data) {
    this.UserService.form.patchValue({roles: this.assigned});
    if (this.UserService.form.valid) {
      if (this.UserService.form.get('id').value) {
        this.UserService.updateUser(this.UserService.form.value)
          .subscribe(response => {
            this.NotifierService.showNotification(response.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.UserService.createUser(this.UserService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.NotifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.UserService.form.reset();
    this.UserService.initializeFormGroup();
    this.dialogRef.close();
  }
}
