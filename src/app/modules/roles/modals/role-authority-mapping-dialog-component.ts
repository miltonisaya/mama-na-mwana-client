import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotifierService} from '../../notifications/notifier.service';
import {FormControl} from '@angular/forms';
import {PrimeNGConfig} from "primeng/api";
import {RolesService} from "../roles.service";
import {AuthorityService} from "../../authorities/authority.service";

@Component({
  selector: 'app-flow-key-dialog',
  templateUrl: 'role-authority-mapping-dialog-component.html',
  styleUrls: ['role-authority--mapping-dialog.component.sass']
})

export class RoleAuthorityMappingDialogComponent implements OnInit {
  list1: any[];
  myList: any;
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
    this.getDataElements();
    this.myList = [];
    this.primengConfig.ripple = true;
  }

  getDataElements() {
    let params = {
      pageSize: 1000
    };
    return this.authoritiesService.getAuthorities(params).subscribe((response: any) => {
      this.list1 = response.data.content;
    }, error => {
      this.notifierService.showNotification(error.message, 'OK', 'error');
      console.log(error);
    });
  }

  saveData() {
    console.log(this.myList)
  }
}



