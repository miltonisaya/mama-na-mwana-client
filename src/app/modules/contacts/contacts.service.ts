import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/contacts';
export const SYNC_CONTACTS_URL: string = 'api/v1/sync-contacts';

@Injectable()

export class ContactsService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private API_ENDPOINT_TO_SYNC = `${BASE_URL}/${SYNC_CONTACTS_URL}`;

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

  /**
   * Get all contacts
   * @param param
   */
  getContacts(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }

  /**
   * Delete contact by id
   * @param id
   */
  delete(id): Observable<any> {
    console.log("Deleting contact with id ",id);
    return this.http.delete<any>(this.API_ENDPOINT+"/"+id).pipe(
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

  syncContacts() {
    return this.http.get(this.API_ENDPOINT_TO_SYNC).pipe(
      map(this.extractData)
    );
  }
}
