import { Component, OnInit } from '@angular/core';
import {MenuService} from '../menu.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {RolesService} from "../../roles/roles.service";

@Component({
  selector: 'app-menu-dialog',
  templateUrl: 'menu-dialog-component.html',
  styleUrls: ['menu-dialog.component.sass']
})

export class MenuDialogComponent implements OnInit {
  private params: { pageNo: number; pageSize: number };
  menus;
  roles;
  parentMenus: any;
  constructor(
    public MenuService: MenuService,
    public RoleService: RolesService,
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.getMenus();
    this.getRoles();
    this.getParentMenus();
  }

  //Load menus
  getMenus(){
    this.params = {
      "pageNo" : 0,
      "pageSize" : 1000
    };

    return this.MenuService.getMenus().subscribe((response: any) => {
      this.menus = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.errors,'OK','error');
    });
  }

  getParentMenus(){
    this.params = {
      "pageNo" : 0,
      "pageSize" : 1000
    };

    return this.MenuService.getMenus(this.params).subscribe((response: any) => {
      this.parentMenus = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.error.errors,'OK','error');
    });
  }

  //Load roles
  getRoles(){
    this.params = {
      "pageNo" : 0,
      "pageSize" : 1000
    };

    return this.RoleService.getRoles().subscribe((response: any) => {
      this.roles = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.message,'OK','error');
      console.log(error);
    });
  }

  submitForm(data) {
    if (this.MenuService.form.valid) {
      if (this.MenuService.form.get('id').value) {
        this.MenuService.updateMenu(this.MenuService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.data.message,'OK', 'success');
            this.onClose();
          });
      } else {
        this.MenuService.createMenu(this.MenuService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.error.error,'OK', 'error');
          });
      }
    }
  }

  onClose() {
    this.MenuService.form.reset();
    this.MenuService.initializeFormGroup();
    this.dialogRef.close();
  }
}
