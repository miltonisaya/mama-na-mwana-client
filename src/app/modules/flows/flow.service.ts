import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/rapidpro-flows';
export const SYNC_RESOURCE_URL: string = 'api/v1/sync-rapidpro-flows';
export const FLOW_KEYS_API: string = 'api/v1/rapid-pro-flow-keys';

@Injectable()
export class FlowService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private SYNC_API_ENDPOINT = `${BASE_URL}/${SYNC_RESOURCE_URL}`;
  private KEYS_BY_FLOW_ID_ENDPOINT = `${BASE_URL}/${FLOW_KEYS_API}`;

  constructor(private http: HttpClient) {}

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

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

  getFlows(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  syncFlows() {
    return this.http.get<any>(this.SYNC_API_ENDPOINT).pipe(
      map(this.extractData));
  }

  getKeysByFlowId(id) {
    console.log("Params =>",id);
    return this.http.get(<any>(this.KEYS_BY_FLOW_ID_ENDPOINT + "/"+id)).pipe(
      map(this.extractData));
  }
}
