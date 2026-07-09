import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const raw = localStorage.getItem('MNM_USER');
    if (!raw) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }

    try {
      const user = JSON.parse(raw);
      const token: string = user?.token;
      if (token && this.isTokenExpired(token)) {
        localStorage.removeItem('MNM_USER');
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
      }
    } catch {
      localStorage.removeItem('MNM_USER');
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? (Date.now() / 1000) >= payload.exp : false;
    } catch {
      return true;
    }
  }
}
