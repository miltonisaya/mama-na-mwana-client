import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../components/auth/auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoginDialogComponent} from "../components/login-dialog/login-dialog.component";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    public router: Router,
    public dialog: MatDialog
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
          localStorage.setItem("CURRENT_ROUTE", JSON.stringify(this.router.url));
          this.openLoginDialog();
          console.log("Response unauthorized =>", response);
          // this.router.navigate(["/login"]);
          return next.handle(request);
        }
        return throwError(response);
      })
    )
  }

  openLoginDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginDialogComponent, dialogConfig)
      .afterClosed().subscribe(() => {
      console.log("Dialog closed ...")
    });
  }
}
