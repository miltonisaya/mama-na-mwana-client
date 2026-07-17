import {Component, OnInit} from '@angular/core';
import {MenuService} from '../menu.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {AuthorityService} from '../../authorities/authority.service';
import {UntypedFormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {isValidMaterialIcon, MATERIAL_ICONS, SUGGESTED_MENU_ICONS} from '../../../shared/material-icons';

const MAX_ICON_RESULTS = 50;

// Sentinel "authority" shown as the first option so clearing the field back to
// "visible to everyone" is as easy as picking any other option, not a separate action.
const NO_AUTHORITY_OPTION = {
  id: null,
  name: 'No restriction',
  description: 'Visible to any authenticated user'
};

@Component({
    selector: 'app-menu-dialog',
    templateUrl: 'menu-dialog-component.html',
    styleUrls: ['menu-dialog.component.sass'],
    standalone: false
})

export class MenuDialogComponent implements OnInit {
  menus;
  parentMenus: any;
  authorities: any[] = [];
  authorityControl = new UntypedFormControl('');
  filteredIcons: Observable<string[]>;
  filteredAuthorities: Observable<any[]>;
  private params: { pageNo: number; pageSize: number };

  constructor(
    public MenuService: MenuService,
    public authorityService: AuthorityService,
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getMenus();
    this.getParentMenus();
    this.getAuthorities();

    const iconControl = this.MenuService.form.get('icon');
    this.filteredIcons = iconControl.valueChanges.pipe(
      startWith(iconControl.value ?? ''),
      map(value => this.filterIcons(value))
    );

    this.filteredAuthorities = this.authorityControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displayAuthority(value)),
      map(query => this.filterAuthorities(query))
    );
  }

  // Live preview shown as the field's prefix icon; falls back to a placeholder
  // instead of rendering an invalid ligature name as raw text.
  previewIcon(value: string): string {
    return isValidMaterialIcon(value) ? value : 'help_outline';
  }

  displayAuthority = (authority: any): string => {
    if (!authority) {
      return '';
    }
    return authority.id === null ? authority.name : (authority.description || authority.name);
  };

  private filterIcons(value: string): string[] {
    const query = (value ?? '').trim().toLowerCase();
    if (!query) {
      return [...SUGGESTED_MENU_ICONS];
    }
    return MATERIAL_ICONS.filter(icon => icon.includes(query)).slice(0, MAX_ICON_RESULTS);
  }

  private filterAuthorities(query: string): any[] {
    const q = (query ?? '').trim().toLowerCase();
    const matches = !q
      ? this.authorities
      : this.authorities.filter(a =>
        (a.name ?? '').toLowerCase().includes(q) || (a.description ?? '').toLowerCase().includes(q));

    const noAuthorityMatches = !q ||
      NO_AUTHORITY_OPTION.name.toLowerCase().includes(q) ||
      NO_AUTHORITY_OPTION.description.toLowerCase().includes(q);

    return noAuthorityMatches ? [NO_AUTHORITY_OPTION, ...matches] : matches;
  }

  //Load menus
  getMenus() {
    this.params = {
      "pageNo": 0,
      "pageSize": 1000
    };

    return this.MenuService.getMenus().subscribe((response: any) => {
      this.menus = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getParentMenus() {
    this.params = {
      "pageNo": 0,
      "pageSize": 1000
    };

    return this.MenuService.getMenus(this.params).subscribe((response: any) => {
      this.parentMenus = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  getAuthorities() {
    const params = {pageNo: 0, pageSize: 1000, sortBy: 'name'};
    return this.authorityService.getAuthorities(params).subscribe((response: any) => {
      this.authorities = response.data?.content ?? [];
      this.syncAuthorityControlFromForm();
    }, error => {
      this.notifierService.showNotification(error.error?.error, 'OK', 'error');
    });
  }

  // populateForm() (called by the parent list component before this dialog opens)
  // already set authorityId on the shared form when editing an existing menu; once
  // the authorities list has loaded, reflect that authority's label in the search field.
  private syncAuthorityControlFromForm() {
    const authorityId = this.MenuService.form.get('authorityId').value;
    if (!authorityId) {
      return;
    }
    const match = this.authorities.find(a => a.id === authorityId);
    if (match) {
      this.authorityControl.setValue(match);
    }
  }

  submitForm(data) {
    const authorityValue = this.authorityControl.value;
    const authorityId = authorityValue && typeof authorityValue === 'object' ? authorityValue.id : null;
    this.MenuService.form.patchValue({authorityId});

    if (this.MenuService.form.valid) {
      if (this.MenuService.form.get('id').value) {
        this.MenuService.updateMenu(this.MenuService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.data.message, 'OK', 'success');
            this.onClose();
          });
      } else {
        this.MenuService.createMenu(this.MenuService.form.value)
          .subscribe(data => {
            this.onClose();
          }, error => {
            this.notifierService.showNotification(error.error.error, 'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.MenuService.form.reset();
    this.MenuService.initializeFormGroup();
    this.authorityControl.reset('');
    this.dialogRef.close();
  }
}
