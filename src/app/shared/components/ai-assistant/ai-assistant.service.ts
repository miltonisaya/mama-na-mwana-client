import {Injectable} from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SKIP_GLOBAL_LOADER} from "../../../interceptors/loading.interceptor";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/ai-assistant';

export interface AiAssistantAnswer {
  answer: string;
  columns: string[] | null;
  rows: Array<Record<string, any>> | null;
  sql: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<AiAssistantAnswer> {
    return this.http.post<any>(this.API_ENDPOINT + "/ask", {question}, {
      context: new HttpContext().set(SKIP_GLOBAL_LOADER, true)
    }).pipe(map(res => res?.data));
  }
}
