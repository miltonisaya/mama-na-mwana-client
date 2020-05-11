import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ErrorComponent} from '../../shared/error/error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public username: string = null;
  public password: string = null;

  constructor(private  dialog: MatDialog, private  router: Router) { }

  login(){
    if (this.username === 'admin' && this.password === 'password'){
      this.router.navigate(['users']);
    } else {
        this.dialog.open(ErrorComponent, { data: {
            message:  'Your login information are incorrect!'
          }});
      }
    }

  }


