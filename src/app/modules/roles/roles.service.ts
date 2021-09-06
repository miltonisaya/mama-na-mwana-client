import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()

export class usersService {

  constructor(private http: HttpClient) {}

  private _url:string = 'http://localhost:8081/users';

  getUsers(){
    return this.http.get(this._url);
  }

}
