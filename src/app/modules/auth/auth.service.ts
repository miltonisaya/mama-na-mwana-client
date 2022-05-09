import { Injectable } from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {tap} from 'rxjs/operators';
import {NotifierService} from '../notifications/notifier.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.baseURL + "/api/v1/authenticate";
  currentUserValue: any;

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private router: Router,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);

  }

  login(data : any) {
    return this.http.post<any>(this.url, data).pipe(
      tap(response => {
        const results = [];
        const token = response.data.token;
        const currentUser = response.data.user;
        this.currentUserValue = currentUser;
        currentUser.token = token;
        currentUser.menus = results;
        localStorage.setItem("MNM_USER", JSON.stringify(currentUser));
      }),
    );
  }

  getToken(){
    let user =  JSON.parse(localStorage.getItem("MNM_USER"));
    return user.token;
  }

  signOut() {
    localStorage.removeItem('MNM_USER');
    this.notifierService.showNotification('Logged out successfully','OK','success');
    this.router.navigate(["/login"]);
  }

  // isLoggedIn(){
  //   let user
  // }
}
