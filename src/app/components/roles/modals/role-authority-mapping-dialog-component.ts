import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {AuthorityService} from '../../authorities/authority.service';

interface GroupEntry {
  resource: string;
  authorities: any[];
  checkedCount: number;
}

@Component({
  selector: 'app-role-authority-dialog',
  templateUrl: 'role-authority-mapping-dialog-component.html',
  styleUrls: ['role-authority--mapping-dialog.component.sass']
})
export class RoleAuthorityMappingDialogComponent implements OnInit {
  allAuthorities: any[] = [];
  checkedIds = new Set<string>();
  expandedGroups = new Set<string>();

  search = '';
  searchFocused = false;
  saving = false;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<RoleAuthorityMappingDialogComponent>,
    public notifierService: NotifierService,
    public authoritiesService: AuthorityService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    const assigned: any[] = this.data.authorities || [];
    this.checkedIds = new Set(assigned.map((a: any) => a.id));
    this.loadAvailable(assigned);
  }

  loadAvailable(assigned: any[]) {
    this.loading = true;
    this.authoritiesService.getUnselectedAuthoritiesByRoleId({id: this.data.id}).subscribe(
      (response: any) => {
        const available: any[] = response.data || [];
        this.allAuthorities = [...assigned, ...available].sort((a, b) => {
          const ra = this.getResource(a.description);
          const rb = this.getResource(b.description);
          return ra.localeCompare(rb) || a.name.localeCompare(b.name);
        });
        this.buildGroups(this.allAuthorities).forEach(g => this.expandedGroups.add(g.resource));
        this.loading = false;
      },
      error => {
        this.notifierService.showNotification(
          error.error?.error || 'Failed to load permissions', 'OK', 'error'
        );
        this.loading = false;
      }
    );
  }

  get assignedCount(): number {
    return this.checkedIds.size;
  }

  get filteredGroups(): GroupEntry[] {
    const q = this.search.toLowerCase().trim();
    const source = q
      ? this.allAuthorities.filter(a =>
          a.name.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q)
        )
      : this.allAuthorities;
    return this.buildGroups(source);
  }

  buildGroups(authorities: any[]): GroupEntry[] {
    const map = new Map<string, any[]>();
    for (const auth of authorities) {
      const resource = this.getResource(auth.description);
      if (!map.has(resource)) map.set(resource, []);
      map.get(resource)!.push(auth);
    }
    return Array.from(map.entries()).map(([resource, auths]) => ({
      resource,
      authorities: auths,
      checkedCount: auths.filter((a: any) => this.checkedIds.has(a.id)).length
    }));
  }

  getResource(description: string): string {
    if (!description) return 'Other';
    const sep = description.indexOf(' - ');
    return sep >= 0 ? description.substring(0, sep) : 'Other';
  }

  getMethodLabel(description: string): string {
    if (!description) return '';
    const sep = description.indexOf(' - ');
    return sep >= 0 ? description.substring(sep + 3) : description;
  }

  toggleGroup(resource: string) {
    this.expandedGroups.has(resource)
      ? this.expandedGroups.delete(resource)
      : this.expandedGroups.add(resource);
  }

  isGroupAllChecked(group: GroupEntry): boolean {
    return group.authorities.length > 0 &&
      group.authorities.every((a: any) => this.checkedIds.has(a.id));
  }

  isGroupIndeterminate(group: GroupEntry): boolean {
    const n = group.authorities.filter((a: any) => this.checkedIds.has(a.id)).length;
    return n > 0 && n < group.authorities.length;
  }

  toggleGroupAll(group: GroupEntry, event: any) {
    if (event.checked) {
      group.authorities.forEach((a: any) => this.checkedIds.add(a.id));
    } else {
      group.authorities.forEach((a: any) => this.checkedIds.delete(a.id));
    }
  }

  togglePermission(id: string) {
    this.checkedIds.has(id) ? this.checkedIds.delete(id) : this.checkedIds.add(id);
  }

  trackByResource(_index: number, group: GroupEntry): string {
    return group.resource;
  }

  trackByAuthId(_index: number, auth: any): string {
    return auth.id;
  }

  saveData() {
    this.saving = true;
    const assignedAuthorities = this.allAuthorities.filter((a: any) => this.checkedIds.has(a.id));
    const payload = {...this.data, authorities: assignedAuthorities};
    this.authoritiesService.saveRoleAuthorities(payload).subscribe(
      (response: any) => {
        this.notifierService.showNotification(response.message, 'OK', 'success');
        this.dialogRef.close();
      },
      error => {
        this.notifierService.showNotification(
          error.error?.error || 'Failed to save permissions', 'OK', 'error'
        );
        this.saving = false;
      }
    );
  }
}
