import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const PENDING_RESOURCE_URL: string = 'api/v1/pending-transactions';
export const SENT_RESOURCE_URL: string = 'api/v1/sent-transactions';

@Injectable()

export class TransactionsService {
  private SENT_API_ENDPOINT = `${BASE_URL}/${SENT_RESOURCE_URL}`;
  private PENDING_API_ENDPOINT = `${BASE_URL}/${PENDING_RESOURCE_URL}`;

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
   * Get all pending transactions
   * @param param
   */
  getPendingTransactions(param?): Observable<any> {
    return this.http.get<any>(this.PENDING_API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }

  /**
   * Get all sent transactions
   * @param param
   */
  getSentTransactions(param?): Observable<any> {
    return this.http.get<any>(this.SENT_API_ENDPOINT,{params: param}).pipe(
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
}
