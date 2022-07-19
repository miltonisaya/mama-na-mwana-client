import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/authorities';
export const ROLE_AUTHORITY_RESOURCE_URL: string = 'api/v1/role-authorities';
export const AUTHORITIES_BY_ROLE_RESOURCE_URL: string = 'api/v1/authorities-by-role';
export const UNSELECTED_AUTHORITIES_BY_ROLE_RESOURCE_URL: string = 'api/v1/authorities-not-role';

@Injectable()
export class AuthorityService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private ROLE_AUTHORITY_API_ENDPOINT = `${BASE_URL}/${ROLE_AUTHORITY_RESOURCE_URL}`;
  private AUTHORITIES_BY_ROLE = `${BASE_URL}/${AUTHORITIES_BY_ROLE_RESOURCE_URL}`;
  private UNSELECTED_AUTHORITIES_BY_ROLE = `${BASE_URL}/${UNSELECTED_AUTHORITIES_BY_ROLE_RESOURCE_URL}`;

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

  getAuthorities(params): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params}).pipe(
      map(this.extractData));
  }

  /**
   *
   * @param id
   */
  delete(id): Observable<any> {
    console.log("Deleting authorities with id ",id);
    return this.http.delete<any>(this.API_ENDPOINT+"/"+id).pipe(
      map(this.extractData));
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
   * @param authorities
   */
  createAuthority(authorities): Observable<any> {
    return this.http.post<any>(this.API_ENDPOINT, authorities)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Added authorities with name = ${authorities.name}`)),
        catchError(this.handleError<any>('create authorities'))
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

  updateAuthority(authority): Observable<any> {
    console.log(authority);
    return this.http.put(this.API_ENDPOINT+"/"+authority.id, authority)
      .pipe(tap(_ => console.log(`updated authority with id=${authority.id}`)),
        catchError(this.handleError<any>('update authority'))
      );
  }

  saveRoleAuthorities(data): Observable<any> {
    return this.http.post<any>(this.ROLE_AUTHORITY_API_ENDPOINT, data)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Mapped role authorities`)),
        catchError(this.handleError<any>('Role authorities mapping'))
      );
  }

  getAuthoritiesByRoleId(data: any) {
    return this.http.get<any>(this.AUTHORITIES_BY_ROLE+"/"+data.id).pipe(
      map(this.extractData));
  }

  getUnselectedAuthoritiesByRoleId(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    console.log("Getting authorities by note role with id ",data.id);
    return this.http.get<any>(this.UNSELECTED_AUTHORITIES_BY_ROLE+"/"+data.id,httpOptions).pipe(
      map(this.extractData));
  }
}
