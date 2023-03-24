import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user;
  roles;
  menus;

  constructor() {
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem("MNM_USER"));
    this.roles = this.user.roles;
    this.menus = this.user.menus;
  }
}
