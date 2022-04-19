import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/outgoing-transactions';
export const WEB_SOCKET_URL: string = 'socket';

@Injectable()

export class TransactionsService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {
  }

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
   * Get all transactions
   * @param param
   */
  getTransactions(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params: param}).pipe(
      map(this.extractData));
  }

}

