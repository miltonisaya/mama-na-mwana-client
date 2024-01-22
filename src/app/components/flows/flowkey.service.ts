import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/rapidpro-flows';
export const SYNC_RESOURCE_URL: string = 'api/v1/sync-rapidpro-flows';
export const FLOW_KEYS_API: string = 'api/v1/get-rapid-pro-flow-keys-by-flow-id';
export const MAP_DATA_ELEMENT_API: string = 'api/v1/map-data-element';
export const MAP_DATA_ELEMENT_WITH_CATEGORY_API: string = 'api/v1/flows/map-data-element-with-category';

@Injectable()
export class FlowKeyService {
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    dataElementId: new FormControl('', [Validators.required]),
    rapidProFlowId: new FormControl('', [Validators.required])
  });
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  private SYNC_API_ENDPOINT = `${BASE_URL}/${SYNC_RESOURCE_URL}`;
  private KEYS_BY_FLOW_ID_ENDPOINT = `${BASE_URL}/${FLOW_KEYS_API}`;
  private MAP_DATA_ELEMENT_ENDPOINT = `${BASE_URL}/${MAP_DATA_ELEMENT_API}`;
  private MAP_DATA_ELEMENT_WITH_CATEGORY_ENDPOINT = `${BASE_URL}/${MAP_DATA_ELEMENT_WITH_CATEGORY_API}`;

  constructor(private http: HttpClient) {
  }

  getFlows(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params: param}).pipe(
      map(this.extractData));
  }

  syncFlows() {
    return this.http.get<any>(this.SYNC_API_ENDPOINT).pipe(
      map(this.extractData));
  }

  getKeysByFlowId(id) {
    console.log("Params =>", id);
    return this.http.get(<any>(this.KEYS_BY_FLOW_ID_ENDPOINT + "/" + id)).pipe(
      map(this.extractData));
  }

  /**
   *
   * @param data
   */
  populateForm(data) {
    this.form.setValue(data);
  }

  initializeFormGroup() {

  }

  updateFlowKey(flowKey): Observable<any> {
    return this.http.put(this.API_ENDPOINT + "/" + flowKey.id, flowKey)
      .pipe(tap(_ => console.log(`updated flow key with id=${flowKey.id}`)),
        catchError(this.handleError<any>('update flow key'))
      );
  }

  mapDataElement(data) {
    return this.http.put(this.MAP_DATA_ELEMENT_ENDPOINT, data)
      .pipe(tap(_ => console.log(`Mapped flow key with data element=${data.dataElementId}`)),
        catchError(this.handleError<any>('Mapped flow key'))
      );
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  mapDataElementsWithCategory(data: { noDataElementId: any; yesDataElementId: any; categoryId: any }) {
    return this.http.put(this.MAP_DATA_ELEMENT_WITH_CATEGORY_ENDPOINT+"/"+data.categoryId, data)
      .pipe(tap(_ => console.log(`Mapped flow data elements with category=${data.categoryId}`)),
        catchError(this.handleError<any>('Mapped flow category with data elements'))
      );
  }
}
