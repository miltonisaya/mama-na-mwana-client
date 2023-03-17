import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const PENDING_RESOURCE_URL: string = 'api/v1/pending-transactions';
export const SENT_RESOURCE_URL: string = 'api/v1/sent-transactions';
export const ALL_RESOURCE_URL: string = 'api/v1/outbox';
export const RESET_TRANSACTIONS_RESOURCE_URL: string = 'api/v1/reset-failed-transaction';

@Injectable()

export class TransactionsService {
  private SENT_API_ENDPOINT = `${BASE_URL}/${SENT_RESOURCE_URL}`;
  private PENDING_API_ENDPOINT = `${BASE_URL}/${PENDING_RESOURCE_URL}`;
  private ALL_API_ENDPOINT = `${BASE_URL}/${ALL_RESOURCE_URL}`;
  private RESET_TRANSACTION_API_END_POINT = `${BASE_URL}/${RESET_TRANSACTIONS_RESOURCE_URL}`;

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
   * Get all transactions
   * @param param
   */
  getAll(param?): Observable<any> {
    return this.http.get<any>(this.ALL_API_ENDPOINT,{params: param}).pipe(
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

  resetTrx(param): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    return this.http.get<any>(this.RESET_TRANSACTION_API_END_POINT+"/"+param.id, httpOptions).pipe(
      map(this.extractData));
  }
}
