import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/programs';
export const SYNC_RESOURCE_URL: string = 'api/v1/sync-programs';
export const MAP_DATA_ELEMENTS_RESOURCE: string = 'map-data-elements';


@Injectable()
export class ProgramService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private SYNC_API_ENDPOINT = `${BASE_URL}/${SYNC_RESOURCE_URL}`;
  private MAP_DATA_ELEMENTS_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}/${MAP_DATA_ELEMENTS_RESOURCE}`;

  constructor(private http: HttpClient) {
  }

  getDataElements(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params: param}).pipe(
      map(this.extractData));
  }

  syncPrograms() {
    return this.http.get<any>(this.SYNC_API_ENDPOINT).pipe(
      map(this.extractData));
  }

  mapDataElements(payload): Observable<any> {
    return this.http.post<any>(this.MAP_DATA_ELEMENTS_ENDPOINT, payload)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Mapped data elements with program with id = ${payload.programId}`)),
        catchError(this.handleError<any>('Map program with data element'))
      );
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
