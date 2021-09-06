import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/roles';

@Injectable()
export class rolesService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {}

  /**
   * helper function to extract data since
   * we are not using a type checker in the request
   * @returns Observable
   *
   * @param res
   */
  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT).pipe(
      map(this.extractData));
  }
}
