import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, tap} from 'rxjs/operators';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {isValidMaterialIcon} from '../../shared/material-icons';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/menus';

function materialIconValidator(control: AbstractControl): ValidationErrors | null {
  return !control.value || isValidMaterialIcon(control.value) ? null : {invalidIcon: true};
}

@Injectable()
export class MenuService {
  form: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(''),
    name: new UntypedFormControl('', [Validators.required]),
    icon: new UntypedFormControl('', [Validators.required, materialIconValidator]),
    url: new UntypedFormControl(''),
    // Optional: no authority means the menu is visible to any authenticated user.
    authorityId: new UntypedFormControl(''),
    sortOrder: new UntypedFormControl('', [Validators.required]),
    parentId: new UntypedFormControl('')
  });
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {
  }

  getMenus(param?): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params: param}).pipe(
      map(this.extractData));
  }

  /**
   *
   * @param id
   */
  delete(id): Observable<any> {
    console.log("Deleting menu with id ", id);
    return this.http.delete<any>(this.API_ENDPOINT + "/" + id).pipe(
      map(this.extractData));
    ``
  }

  /**
   *
   * @param data
   */
  populateForm(data) {
    this.form.patchValue(data);
  }

  initializeFormGroup() {
    return this.form.patchValue({
      id: '',
      name: '',
      icon: '',
      parentId: '',
      url: '',
      authorityId: '',
      sortOrder: ''
    });
  }

  /**
   * @param menu
   */
  createMenu(menu): Observable<any> {
    console.log(menu);
    return this.http.post<any>(this.API_ENDPOINT, menu)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Added menu with name = ${menu.name}`)),
        catchError(this.handleError<any>('create menu'))
      );
  }

  updateMenu(menu): Observable<any> {
    console.log(menu);
    return this.http.put(this.API_ENDPOINT + "/" + menu.id, menu)
      .pipe(tap(_ => console.log(`updated menu with id=${menu.id}`)),
        catchError(this.handleError<any>('update menu'))
      );
  }

  compareObjects(o1, o2) {
    return o1 && o2 && o1.id === o2.id;
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
}
