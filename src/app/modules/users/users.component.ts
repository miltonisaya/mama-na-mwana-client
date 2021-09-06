import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    let users = this.http.get("http://localhost:8081/api/v1/users").subscribe(res => {
      console.log(res);
      }
    );
  }

}
