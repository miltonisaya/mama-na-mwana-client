import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

export const BASE_URL: string = environment.baseURL;
export const CATEGORIES_API: string = 'api/v1/categories';

@Injectable()
export class CategoryService {
  private CATEGORIES_ENDPOINT = `${BASE_URL}/${CATEGORIES_API}`;

  constructor(
    private http: HttpClient
  ) {
  }

  savePossibleValues(payload): Observable<any> {
    return this.http.post(this.CATEGORIES_ENDPOINT + "/possible-values", payload)
      .pipe(tap(_ => console.log(`Saved possible values for category with the id ${payload.categoryId}`)),
        catchError(this.handleError<any>('Save possible values'))
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
