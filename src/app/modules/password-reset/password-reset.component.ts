import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotifierService} from '../notifications/notifier.service';
import {UsersService} from "../users/users.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-users',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  userId: string;
  user;

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private userService: UsersService
  ) { }

  profileForm = new FormGroup({
    name : new FormControl(''),
    email : new FormControl(''),
    phone : new FormControl(''),
    username : new FormControl(''),
    password : new FormControl(''),
    confirmPassword : new FormControl(''),
    title : new FormControl('')
    }
  );

  ngOnInit(): void {
    this.findUserDetailsById();
    this.updateFormValues();
  }

  findUserDetailsById(){
    let user =  JSON.parse(localStorage.getItem("MNM_USER"));
    this.userId = user.id;
    let params = {
      "id" : this.userId
    };

    this.userService.findById(params).subscribe((response) =>{
      this.user = response.data;
    }, (error)=>{
      console.log(error);
      this.notifierService.showNotification(error.message,'OK','error');
    })
  }

  updateFormValues(){
    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone : this.user.phone,
      title : this.user.title
    });
  }
}
