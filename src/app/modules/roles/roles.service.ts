import { Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/roles';

@Injectable()
export class rolesService {
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

  getRoles(param?): Observable<any> {
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
  createRole(role): Observable<any> {
    console.log(role);
    return this.http.post<any>(this.API_ENDPOINT, role)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Added role with name = ${role.name}`)),
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

  updateRole(role): Observable<any> {
    console.log(role);
    return this.http.put(this.API_ENDPOINT+"/"+role.id, role)
      .pipe(tap(_ => console.log(`updated role with id=${role.id}`)),
        catchError(this.handleError<any>('update role'))
      );
  }
}
