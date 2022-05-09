import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/parent-organisation-units';

@Injectable()
export class OrganisationUnitService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

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

  getOrganisationUnits(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }

  /**
   *
   * @param id
   */
  delete(id): Observable<any> {
    console.log("Deleting role with id ",id);
    return this.http.delete<any>(this.API_ENDPOINT+"/"+id).pipe(
      map(this.extractData));``
  }

  /**
   *
   * @param data
   */
  populateForm (data){
    this.form.setValue(data);
  }

  initializeFormGroup(){
    return this.form.setValue({
      id: '',
      name: '',
      description: ''
    });
  }

  /**
   * @param role
   */
  createOrganisationUnit(ou): Observable<any> {
    console.log(ou);
    return this.http.post<any>(this.API_ENDPOINT, ou)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Added role with name = ${ou.name}`)),
        catchError(this.handleError<any>('create objective'))
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

  updateOrganisationUnit(ou): Observable<any> {
    console.log(ou);
    return this.http.put(this.API_ENDPOINT+"/"+ou.id, ou)
      .pipe(tap(_ => console.log(`updated organisation unit with id=${ou.id}`)),
        catchError(this.handleError<any>('update organisation unit'))
      );
  }
}
