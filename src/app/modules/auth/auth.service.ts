import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.baseURL + "/api/v1/authenticate";
  responseData;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(data : any) {
    return this.http.post<any>(this.url, data).pipe(
      tap(response => {
        const results = [];
        const token = response.data.token;
        const currentUser = response.data.user;
        currentUser.token = token;
        currentUser.menus = results;
        localStorage.setItem("MNM_USER", JSON.stringify(currentUser));
      }),
    );
  }

  getToken(){
    return "jwt-token"
  }
}
