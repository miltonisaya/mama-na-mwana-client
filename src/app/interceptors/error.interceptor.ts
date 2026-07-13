import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotifierService } from '../components/notifications/notifier.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notifier: NotifierService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // 401 is handled by AuthInterceptor (shows login dialog) — skip toast
        if (err.status === 401) {
          return throwError(() => err);
        }

        const message =
          err.error?.error ||
          err.error?.message ||
          err.message ||
          (err.status ? `Request failed (${err.status})` : 'An unexpected error occurred');

        this.notifier.showNotification(message, 'OK', 'error');
        return throwError(() => err);
      })
    );
  }
}
