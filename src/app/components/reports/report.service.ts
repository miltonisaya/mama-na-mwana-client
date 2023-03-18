import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/reports';

@Injectable()
export class ReportService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  compareObjects(o1, o2) {
    return o1 && o2 && o1.id === o2.id;
  }
  constructor(private http: HttpClient) {}

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    url: new FormControl('')
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

  getReports(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT+"/tree",{params: param}).pipe(
      map(this.extractData));
  }

  /**
   *
   * @param id
   */
  delete(id): Observable<any> {
    console.log("Deleting report with id ",id);
    return this.http.delete<any>(this.API_ENDPOINT+"/"+id).pipe(
      map(this.extractData));  }

  /**
   *
   * @param data
   */
  populateForm (data){
    this.form.patchValue(data);
  }

  initializeFormGroup(){
    return this.form.patchValue({
      id: '',
      name: '',
      url: '',
      parent: ''
    });
  }

  /**
   * @param report
   */
  createRole(report): Observable<any> {
    return this.http.post<any>(this.API_ENDPOINT, report)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Added report with name = ${report.name}`)),
        catchError(this.handleError<any>('create report'))
      );
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

  updateRole(report): Observable<any> {
    return this.http.put(this.API_ENDPOINT+"/"+report.id, report)
      .pipe(tap(_ => console.log(`updated report with id=${report.id}`)),
        catchError(this.handleError<any>('update report'))
      );
  }
}
