import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const PENDING_RESOURCE_URL: string = 'api/v1/pending-transactions';
export const SENT_RESOURCE_URL: string = 'api/v1/sent-transactions';
export const ALL_RESOURCE_URL: string = 'api/v1/outbox';
export const RESET_TRANSACTIONS_RESOURCE_URL: string = 'api/v1/reset-failed-transaction';
export const FAILED_COUNT_URL: string = 'api/v1/failed-count';
export const SENT_COUNT_URL: string = 'api/v1/sent-count';
export const PENDING_COUNT_URL: string = 'api/v1/pending-count';

@Injectable()
export class TransactionsService {
  private SENT_API_ENDPOINT = `${BASE_URL}/${SENT_RESOURCE_URL}`;
  private PENDING_API_ENDPOINT = `${BASE_URL}/${PENDING_RESOURCE_URL}`;
  private ALL_API_ENDPOINT = `${BASE_URL}/${ALL_RESOURCE_URL}`;
  private RESET_TRANSACTION_API_END_POINT = `${BASE_URL}/${RESET_TRANSACTIONS_RESOURCE_URL}`;
  private FAILED_COUNT_ENDPOINT = `${BASE_URL}/${FAILED_COUNT_URL}`;
  private SENT_COUNT_ENDPOINT = `${BASE_URL}/${SENT_COUNT_URL}`;
  private PENDING_COUNT_ENDPOINT = `${BASE_URL}/${PENDING_COUNT_URL}`;

  constructor(private http: HttpClient) {}

  getPendingTransactions(param?): Observable<any> {
    return this.http.get<any>(this.PENDING_API_ENDPOINT, {params: param}).pipe(map(this.extractData));
  }

  getAll(param?): Observable<any> {
    return this.http.get<any>(this.ALL_API_ENDPOINT, {params: param}).pipe(map(this.extractData));
  }

  getSentTransactions(param?): Observable<any> {
    return this.http.get<any>(this.SENT_API_ENDPOINT, {params: param}).pipe(map(this.extractData));
  }

  getFailedCount(): Observable<any> {
    return this.http.get<any>(this.FAILED_COUNT_ENDPOINT).pipe(map(this.extractData));
  }

  getSentCount(params?: any): Observable<any> {
    return this.http.get<any>(this.SENT_COUNT_ENDPOINT, {params}).pipe(map(this.extractData));
  }

  getPendingCount(params?: any): Observable<any> {
    return this.http.get<any>(this.PENDING_COUNT_ENDPOINT, {params}).pipe(map(this.extractData));
  }

  resetTrx(param): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(this.RESET_TRANSACTION_API_END_POINT + "/" + param.id, null, httpOptions).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
