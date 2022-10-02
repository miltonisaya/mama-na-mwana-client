import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export const BASE_URL: string = environment.baseURL;
export const REGISTRATION_STATS_BY_MONTHS: string = 'api/v1/get-registrations-by-months';
export const REGISTRATION_STATS_BY_COUNCIL: string = 'api/v1/get-registrations-by-council';
export const TOTAL_NUMBER_OF_REGISTRATIONS: string = 'api/v1/get-number-of-registrations';
export const TOTAL_NUMBER_OF_REGISTRATIONS_TODAY: string = 'api/v1/contacts/registered-today';
export const TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART: string = 'api/v1/get-number-of-registrations-in-bar-chart';
export const NUMBER_OF_REGISTRATIONS_BETWEEN_DATES: string = 'api/v1/registrations-between-dates';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private REGISTRATION_STATS_BY_MONTHS_API_ENDPOINT = `${BASE_URL}/${REGISTRATION_STATS_BY_MONTHS}`;
  private REGISTRATION_STATS_BY_COUNCIL_API_ENDPOINT = `${BASE_URL}/${REGISTRATION_STATS_BY_COUNCIL}`;
  private TOTAL_NUMBER_OF_REGISTRATIONS_API_ENDPOINT = `${BASE_URL}/${TOTAL_NUMBER_OF_REGISTRATIONS}`;
  private TOTAL_NUMBER_OF_REGISTRATIONS_TODAY_API_ENDPOINT = `${BASE_URL}/${TOTAL_NUMBER_OF_REGISTRATIONS_TODAY}`;
  private TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART_API_ENDPOINT = `${BASE_URL}/${TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART}`;
  private REGISTRATIONS_BETWEEN_DATES_API_END_POINT = `${BASE_URL}/${NUMBER_OF_REGISTRATIONS_BETWEEN_DATES}`;

  constructor(
    private http: HttpClient
  ) { }

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

  registrationsForm: FormGroup = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  });

  /**
   * Get all monthly registrations
   * @param param
   */
  getMonthlyRegistrations(param?): Observable<any> {
    return this.http.get<any>(this.REGISTRATION_STATS_BY_MONTHS_API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }
  /**
   * Get all registrations by council
   * @param param
   */
  getRegistrationsByCouncil(param?): Observable<any> {
    return this.http.get<any>(this.REGISTRATION_STATS_BY_COUNCIL_API_ENDPOINT,{params: param}).pipe(
      map(this.extractData));
  }

  getNumberOfAllContacts(): Observable<any> {
    return this.http.get<any>(this.TOTAL_NUMBER_OF_REGISTRATIONS_API_ENDPOINT,{}).pipe(
      map(this.extractData));
  }

  getNumberOfRegistrationsInBarChart() {
    return this.http.get<any>(this.TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART_API_ENDPOINT,{}).pipe(
      map(this.extractData));
  }

  findRegistrationsByDate(params: any, params1: { endDate: any; startDate: any }) {
    return this.http.get<any>(this.REGISTRATIONS_BETWEEN_DATES_API_END_POINT,{}).pipe(
      map(this.extractData));
  }

  getNumberOfTodayContacts() {
    return this.http.get<any>(this.TOTAL_NUMBER_OF_REGISTRATIONS_TODAY_API_ENDPOINT,{}).pipe(
      map(this.extractData));
  }
}
