import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/contacts';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  registrationsForm: FormGroup = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  });
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Get all monthly registrations
   * @param param
   */
  getMonthlyRegistrations(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT+"/registrations-by-months", {params: param}).pipe(
      map(this.extractData));
  }

  /**
   * Get all registrations by council
   * @param param
   */
  getRegistrationsByCouncil(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT+"/registrations-by-council", {params: param}).pipe(
      map(this.extractData));
  }

  getNumberOfAllContacts(): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT+"/number-of-registrations", {}).pipe(
      map(this.extractData));
  }

  getNumberOfRegistrationsInBarChart() {
    return this.http.get<any>(this.API_ENDPOINT+"/registrations-bar-chart", {}).pipe(
      map(this.extractData));
  }
  getNumberOfTodayContacts() {
    return this.http.get<any>(this.API_ENDPOINT+"/registered-today", {}).pipe(
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
