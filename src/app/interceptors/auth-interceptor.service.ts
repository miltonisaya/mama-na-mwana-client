import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../components/auth/auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    public router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(request).pipe(
      catchError(response => {
        if (response.status === 401) {
          console.log("Response unauthorized =>",response);
          this.router.navigate(["/login"]);
          return next.handle(request);
        }
        return throwError(response);
      })
    )
  }

  private showLoginDialog() {
    // Implement logic to show your login dialog here
    // You might want to use a dialog component or a service to manage the login dialog
    console.log('Show login dialog...');
  }
}
