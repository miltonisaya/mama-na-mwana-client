import { Component, OnInit } from '@angular/core';
import {MenuService} from '../menu.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: 'menu-dialog-component.html',
  styleUrls: ['menu-dialog.component.sass']
})

export class MenuDialogComponent implements OnInit {
  constructor(
    public MenuService: MenuService,
    public dialogRef: MatDialogRef<MenuDialogComponent>,
    public notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  submitForm(data) {
    if (this.MenuService.form.valid) {
      if (this.MenuService.form.get('id').value) {
        this.MenuService.updateMenu(this.MenuService.form.value)
          .subscribe(response => {
            this.notifierService.showNotification(response.message,'OK', 'success');
            this.onClose();
          });
      } else {
        this.MenuService.createMenu(this.MenuService.form.value)
          .subscribe(data => {
            this.onClose();
          },error => {
            this.notifierService.showNotification(error.message,'OK', 'error');
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
