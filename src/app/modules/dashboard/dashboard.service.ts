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

  // bigChart() {
  //   return [{
  //     name: 'Asia',
  //     data: [502,635,809,947,1402,3634,5268]
  //   }, {
  //     name: 'Africa',
  //     data: [323,43,22,345,1402,63,532]
  //   }, {
  //     name: 'Europe',
  //     data: [145,302,224,809,219,12,334]
  //   }, {
  //     name: 'America',
  //     data: [18,31,54,156,339,818,1201]
  //   },
  //     {
  //     name: 'Oceania',
  //     data: [2,2,2,6,13,30,46]
  //   }];
  // }

  // cards() {
  //   return [70,71,39,66];
  // }

  // barChart() {
  //   return [{
  //     name: 'Tokyo',
  //     data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
  //
  //   }, {
  //     name: 'New York',
  //     data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
  //
  //   }, {
  //     name: 'London',
  //     data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
  //
  //   }, {
  //     name: 'Berlin',
  //     data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
  //
  //   }];
  // }

}
