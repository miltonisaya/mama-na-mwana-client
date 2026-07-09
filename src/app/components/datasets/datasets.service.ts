import {Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import {DataElement} from "../data-elements/dataElement";

export const BASE_URL: string = environment.baseURL;

export interface Dataset {
  id: string;
  displayName: string;
  code: string;
  dataElements?: DataElement[];
}

@Injectable({
  providedIn: 'root',
})

export class DatasetsService {
  private readonly baseApiUrl = BASE_URL + "/api/v1"; // Replace with your base API URL
  private datasetsEndpoint = `${this.baseApiUrl}/data-sets`;
  private dataElementEndpoint = `${this.baseApiUrl}/data-elements`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all datasets
   * @returns Observable of Dataset array
   */
  getAllDatasets(): Observable<any> {
    console.log(this.datasetsEndpoint);
    return this.http.get<any>(this.datasetsEndpoint).pipe(
      retry(3), // Retry the request up to 3 times
      catchError(this.handleError)
    );
  }

  /**
   * @returns Observable of the Dataset
   */
  syncDatasets(): Observable<any> {
    const url = `${this.datasetsEndpoint}/sync-data-sets`;
    console.log("The url =>", url);
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new dataset
   * @param dataset Dataset object
   * @returns Observable of the created Dataset
   */
  createDataset(dataset: Dataset): Observable<Dataset> {
    return this.http.post<Dataset>(this.datasetsEndpoint, dataset).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing dataset
   * @param id Dataset ID
   * @param dataset Dataset object
   * @returns Observable of the updated Dataset
   */
  updateDataset(id: string, dataset: Partial<Dataset>): Observable<Dataset> {
    const url = `${this.datasetsEndpoint}/${id}`;
    return this.http.put<Dataset>(url, dataset).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a dataset
   * @param id Dataset ID
   * @returns Observable of void
   */
  deleteDataset(id: string): Observable<void> {
    const url = `${this.datasetsEndpoint}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   * @returns Observable that throws an error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend error
      console.error(
        `Server-side error: ${error.status} - ${error.message}`
      );
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  findByDataset(selectedDataSetId: string): Observable<any> {
    const url = `${this.dataElementEndpoint}/datasets/${selectedDataSetId}`;
    console.log('The url =>', url);
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
}
