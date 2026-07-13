import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotifierService } from '../notifications/notifier.service';
import { AuthResponse, LoginCredentials, UserProfile } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = `${environment.baseURL}/api/v1/authenticate`;
  private readonly storageKey = 'MNM_USER';

  // HttpBackend bypasses interceptors so no auth token is attached to the login request
  private readonly http: HttpClient;

  constructor(
    handler: HttpBackend,
    private notifier: NotifierService,
    private router: Router,
  ) {
    this.http = new HttpClient(handler);
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, credentials).pipe(
      tap(response => this.persistSession(response)),
    );
  }

  getToken(): string | null {
    return this.getStoredUser()?.token ?? null;
  }

  signOut(): void {
    localStorage.removeItem(this.storageKey);
    this.notifier.showNotification('Logged out successfully', 'OK', 'success');
    this.router.navigate(['/login']);
  }

  private persistSession(response: AuthResponse): void {
    const { token, user, menus, authorities } = response.data;
    const profile: UserProfile = { ...user, token, menus, authorities: authorities ?? [] };
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  private getStoredUser(): UserProfile | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }
}
