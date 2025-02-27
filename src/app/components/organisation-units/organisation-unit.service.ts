import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/organisation-units';

@Injectable({
  providedIn: 'root', // Assuming you want it as a singleton service
})
export class OrganisationUnitService {
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    otherNames: new FormControl(''),
    parentId: new FormControl(''),
  });

  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {}

  // Fetch root organisation units (no parent)
  getRootOrganisationUnits(param?: any): Observable<any> {
    return this.http
      .get<any>(`${this.API_ENDPOINT}/root`, { params: param })
      .pipe(map(this.extractData));
  }

  // Fetch children of a specific organisation unit
  getChildren(id: string, param?: any): Observable<any> {
    return this.http
      .get<any>(`${this.API_ENDPOINT}/${id}/children`, { params: param })
      .pipe(map(this.extractData));
  }

  // Existing method (renamed for clarity, kept for backward compatibility if needed)
  getOrganisationUnits(param?: any): Observable<any> {
    return this.http
      .get<any>(`${this.API_ENDPOINT}/parent-organisation-units`, { params: param })
      .pipe(map(this.extractData));
  }

  delete(id: string): Observable<any> {
    console.log('Deleting ou with id ', id);
    return this.http.delete<any>(`${this.API_ENDPOINT}/${id}`).pipe(map(this.extractData));
  }

  populateForm(data: any) {
    this.form.patchValue(data);
  }

  initializeFormGroup() {
    return this.form.setValue({
      id: '',
      name: '',
      code: '',
      parentId: '',
      otherNames: '',
    });
  }

  createOrganisationUnit(ou: any): Observable<any> {
    console.log(ou);
    return this.http
      .post<any>(this.API_ENDPOINT, ou)
      .pipe(
        tap((response) => console.log(`Added organisation unit with name = ${ou.name}`)),
        catchError(this.handleError<any>('create organisation unit'))
      );
  }

  updateOrganisationUnit(ou: any): Observable<any> {
    console.log(ou);
    return this.http
      .put(`${this.API_ENDPOINT}/${ou.id}`, ou)
      .pipe(
        tap(() => console.log(`updated organisation unit with id=${ou.id}`)),
        catchError(this.handleError<any>('update organisation unit'))
      );
  }

  getCouncils(param?: any): Observable<any> {
    return this.http
      .get<any>(`${this.API_ENDPOINT}/councils`, { params: param })
      .pipe(map(this.extractData));
  }

  private extractData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
