import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/rapidpro-runs';
export const SYNC_RESOURCE_URL: string = 'api/v1/sync-rapidpro-runs';

@Injectable()
export class RunsService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private SYNC_API_ENDPOINT = `${BASE_URL}/${SYNC_RESOURCE_URL}`;

  constructor(private http: HttpClient) {
  }

  getRuns(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params: param}).pipe(
      map(this.extractData));
  }

  syncRuns(): Observable<any> {
    return this.http.get<any>(this.SYNC_API_ENDPOINT).pipe(
      map(this.extractData));
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
}
