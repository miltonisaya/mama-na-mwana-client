import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from "@angular/forms";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/contacts';
export const REGISTRATION_BY_FACILITY_URL: string = 'api/v1/contacts/registration-by-facility';
export const REGISTRATIONS_IN_AGE_GROUPS_URL: string = 'api/v1/contacts/responses-by-age-and-visit';

@Injectable()

export class ContactsService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private API_ENDPOINT_TO_GET_REGISTRATIONS_BY_FACILITY = `${BASE_URL}/${REGISTRATION_BY_FACILITY_URL}`;
  private API_ENDPOINT_REGISTRATIONS_IN_AGE_GROUPS = `${BASE_URL}/${REGISTRATIONS_IN_AGE_GROUPS_URL}`;

  constructor(private http: HttpClient) {}

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
   * Get all contacts
   * @param param
   */
  getContacts(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }

  /**
   * Delete contact by id
   * @param id
   */
  delete(id): Observable<any> {
    console.log("Deleting contact with id ",id);
    return this.http.delete<any>(this.API_ENDPOINT+"/"+id).pipe(
      map(this.extractData));
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

  registrationsByFacility() {
    return this.http.get(this.API_ENDPOINT_TO_GET_REGISTRATIONS_BY_FACILITY).pipe(
      map(this.extractData)
    );
  }

  /**
   *
   * @param data
   */
  populateForm (data){
    this.form.setValue(data);
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    facilityCode: new FormControl('', [Validators.required])
  });

  updateContact(contact: any) {
    return this.http.put(this.API_ENDPOINT+"/"+contact.id, contact)
      .pipe(tap(_ => console.log(`updated contact with id=${contact.id}`)),
        catchError(this.handleError<any>('update contact'))
      );
  }

  initializeFormGroup(){
    return this.form.setValue({
      id: '',
      facilityCode: ''
    });
  }

  responsesInAgeGroups(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(this.API_ENDPOINT_REGISTRATIONS_IN_AGE_GROUPS,params, httpOptions).pipe(
      map(this.extractData)
    );
  }
}
