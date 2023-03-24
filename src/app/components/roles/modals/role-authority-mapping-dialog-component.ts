import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {FormControl} from '@angular/forms';
import {PrimeNGConfig} from "primeng/api";
import {AuthorityService} from "../../authorities/authority.service";

@Component({
  selector: 'app-role-authority-dialog',
  templateUrl: 'role-authority-mapping-dialog-component.html',
  styleUrls: ['role-authority--mapping-dialog.component.sass']
})

export class RoleAuthorityMappingDialogComponent implements OnInit {
  unSelectedList: any[];
  selectedList: [];
  myControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<RoleAuthorityMappingDialogComponent>,
    public notifierService: NotifierService,
    public authoritiesService: AuthorityService,
    private primengConfig: PrimeNGConfig,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getUnselectedAuthorities();
    this.selectedList = [];
    this.primengConfig.ripple = true;
    this.getSelectedAuthorities();
  }

  getSelectedAuthorities() {
    this.selectedList = this.data.authorities;
  }

  getUnselectedAuthorities() {
    return this.authoritiesService.getUnselectedAuthoritiesByRoleId({id: this.data.id}).subscribe((response: any) => {
      this.unSelectedList = response.data;
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    });
  }

  saveData() {
    this.data.authorities = this.selectedList;
    console.log(this.data);
    return this.authoritiesService.saveRoleAuthorities(this.data).subscribe((response: any) => {
      this.notifierService.showNotification(response.message, 'OK', 'success');
      this.dialogRef.close();
    }, error => {
      this.notifierService.showNotification(error.error.error, 'OK', 'error');
    })
  }
}



