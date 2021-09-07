import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.baseURL + "/api/v1/authenticate";
  constructor(private http: HttpClient) { }

  login(data):Observable<any>{
    console.log(this.url);
    // return this.url;
    return this.http.post(this.url,data);
  }

  getToken(){
    return "jwt-token"
  }
}
