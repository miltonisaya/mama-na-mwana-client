import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/contacts';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {}

  getMonthlyRegistrations(params?: any): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/registrations-by-months", {params}).pipe(map(this.extractData));
  }

  getRegistrationsByCouncil(params?: any): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/registrations-by-council", {params}).pipe(map(this.extractData));
  }

  getNumberOfAllContacts(params?: any): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/number-of-registrations", {params}).pipe(map(this.extractData));
  }

  getNumberOfRegistrationsInBarChart(params?: any): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/registrations-bar-chart", {params}).pipe(map(this.extractData));
  }

  getNumberOfTodayContacts(): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/registered-today", {}).pipe(map(this.extractData));
  }

  getContactsBySex(params?: any): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/stats/by-sex", {params}).pipe(map(this.extractData));
  }

  getContactsByAgeGroup(params?: any): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/stats/by-age-group", {params}).pipe(map(this.extractData));
  }

  getNarrative(preset: string): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT + "/narrative", {params: {preset}}).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
