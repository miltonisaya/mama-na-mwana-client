import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export const BASE_URL: string = environment.baseURL;
export const REGISTRATION_STATS_BY_MONTHS: string = 'api/v1/get-registrations-by-months';
export const REGISTRATION_STATS_BY_COUNCIL: string = 'api/v1/get-registrations-by-council';
export const TOTAL_NUMBER_OF_REGISTRATIONS: string = 'api/v1/get-number-of-registrations';
export const TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART: string = 'api/v1/get-number-of-registrations-in-bar-chart';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private REGISTRATION_STATS_BY_MONTHS_API_ENDPOINT = `${BASE_URL}/${REGISTRATION_STATS_BY_MONTHS}`;
  private REGISTRATION_STATS_BY_COUNCIL_API_ENDPOINT = `${BASE_URL}/${REGISTRATION_STATS_BY_COUNCIL}`;
  private TOTAL_NUMBER_OF_REGISTRATIONS_API_ENDPOINT = `${BASE_URL}/${TOTAL_NUMBER_OF_REGISTRATIONS}`;
  private TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART_API_ENDPOINT = `${BASE_URL}/${TOTAL_NUMBER_OF_REGISTRATIONS_BAR_CHART}`;

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
}
