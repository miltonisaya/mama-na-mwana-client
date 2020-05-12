import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  loading = true;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  users = [
    {id: 1, full_name: 'Milton Isaya', email: 'rogers_isaiah@gmail.com', organisation_unit: 'Njiro Container', is_active: true},
    {id: 2, full_name: 'Fredrick Sirili', email: 'rogers_isaiah@gmail.com', organisation_unit: 'Moshono', is_active: true},
    {id: 3, full_name: 'Meshack Isaya', email: 'rogers_isaiah@gmail.com', organisation_unit: 'Njiro Container', is_active: true},
    {id: 4, full_name: 'Rogers Isaya', email: 'rogers_isaiah@gmail.com', organisation_unit: 'Njiro Container', is_active: true}
  ];

  dataSource = new MatTableDataSource(this.users);
  displayedColumns  = ['id', 'full_name', 'organisation_unit', 'email', 'is_active'];
  pageSizeOptions = [2, 5, 10];


  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading  =  false;
    }, 2000);
  }

  edit(id: any) {
    console.log(id);
  }

  applyFilter($event: KeyboardEvent) {
    console.log($event);
  }
}
