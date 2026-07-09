# CLAUDE.md — mama-na-mwana-client

Angular 13 admin portal for the Mama na Mwana health integration middleware. Provides dashboards, contact management, flow/data-element configuration, and transaction monitoring for operators who support the Tanzania RapidPro → DHIS2 pipeline.

## Build and run

```bash
npm install
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/
npm test           # Jest unit tests (if configured)
ng serve --port 4200
```

Node 16+ required. Angular CLI 13.3.x.

Backend runs on **port 8081** (`src/environments/environment.ts` → `baseURL: "http://localhost:8081"`).

## Stack

| Layer | Library |
|---|---|
| Framework | Angular 13.3.2 |
| Component lib (primary) | Angular Material 13.3.9 |
| Component lib (secondary) | PrimeNG 13.3.2 (pick-lists, tables in some dialogs) |
| Charts | Highcharts 9.3.3 (via shared widget components) |
| HTTP | Angular `HttpClient` + `HttpInterceptor` |
| State | Component-local (no NgRx, no service-level BehaviorSubjects) |
| Auth | JWT stored in `localStorage['MNM_USER']` |
| Layout | Angular Flex Layout (`fxLayout`) — deprecated in Angular 15+, still in use here |

## Project structure

```
src/app/
  components/          # Feature components; each folder has component + service
    auth/              # AuthService (login/logout/token)
    dashboard/         # Stat cards, bar chart, transaction log
    contacts/          # Contact list, edit dialog
    flows/             # Flow configuration
    data-elements/     # DHIS2 data element mapping
    categories/        # Category-based flow keys
    organisation-units/# Health facility lookup
    programs/          # DHIS2 program config
    datasets/          # Dataset management
    users/             # User CRUD
    roles/             # Role & authority assignment (PrimeNG pick-list)
    authorities/       # Authority list
    transactions/      # Outbox monitoring & retry
    reports/           # Jasper report launcher
    menus/             # Navigation menu management
    login/             # Login page
    login-dialog/      # Session-expiry re-login dialog
    password-reset/    # Profile / change-password
    notifications/     # NotifierService (MatSnackBar wrapper)
    loader/            # Global loading indicator
  helpers/
    auth.guard.ts      # Checks localStorage['MNM_USER'] exists (no token expiry check)
  interceptors/
    auth-interceptor.service.ts  # Adds Bearer token; 401 opens LoginDialogComponent
  layouts/
    default/           # Shell layout: sidenav + toolbar + <router-outlet>
  shared/widgets/      # Reusable chart wrappers (area, bar, card, pie)
  environments/
    environment.ts     # baseURL: "http://localhost:8081"
    environment.prod.ts
```

## Auth flow

1. `POST /api/v1/authenticate` → response contains `{ data: { token, user, menus, isSuperAdmin } }`
2. `AuthService.login()` merges token + menus into the user object and saves to `localStorage['MNM_USER']`
3. `AuthGuard` only checks that the key exists — it does **not** validate expiry
4. `AuthInterceptorService` reads the token on every request; on 401 it opens `LoginDialogComponent` instead of redirecting to `/login`
5. The `console.log("Current User =>", currentUser)` line in `auth.service.ts:34` logs the JWT token to the browser console — remove before production

## API integration pattern

Every service follows the same pattern:

```typescript
export const BASE_URL = environment.baseURL;
export const RESOURCE_URL = 'api/v1/some-resource';

@Injectable()
export class SomeService {
  private API = `${BASE_URL}/${RESOURCE_URL}`;
  constructor(private http: HttpClient) {}

  getAll(param?): Observable<any> {
    return this.http.get<any>(this.API, { params: param }).pipe(map(res => res || {}));
  }
}
```

Responses are wrapped in `CustomApiResponse` from the backend:
```json
{ "status": 200, "message": "...", "data": [...], "page": 0, "size": 20, "total": 123 }
```
Services usually call `.pipe(map(this.extractData))` which returns `res` directly — callers access `.data`, `.content`, `.totalElements` on the result.

## Known bugs and compatibility issues

### Critical: `TransactionsService.resetTrx()` uses GET but backend is POST
`src/app/components/transactions/transactions.service.ts:56`
```typescript
// BUG: backend OutboxResource.resetFailedTransaction is @PostMapping
return this.http.get<any>(this.RESET_TRANSACTION_API_END_POINT + "/" + param.id, httpOptions)
// FIX:
return this.http.post<any>(this.RESET_TRANSACTION_API_END_POINT + "/" + param.id, null, httpOptions)
```

### Minor: sensitive data logged to console
`src/app/components/auth/auth.service.ts:34` — `console.log("Current User =>", currentUser)` logs the JWT token. Remove for production.

### AuthGuard does not check token expiry
`src/app/helpers/auth.guard.ts` — only checks `localStorage.getItem('MNM_USER') !== null`. A user with an expired token will appear authenticated until the first API call triggers a 401 dialog.

### fxLayout (Angular Flex Layout) is deprecated
All templates use `fxLayout`, `fxFlex`, `fxLayoutAlign` directives from `@angular/flex-layout`. These work in Angular 13 but the library is deprecated and unmaintained. Replace with CSS Grid/Flexbox if upgrading beyond Angular 14.

## Backend compatibility notes

These backend types changed in recent migrations — display code should handle them:

| Field | Old type | New type | Notes |
|---|---|---|---|
| `contact.registrationDate` | `Date` (ISO string) | `LocalDateTime` (array `[y,mo,d,h,min,s]`) | Jackson serialises `LocalDateTime` as array by default unless `@JsonSerialize` is configured |
| `contact.createdOn` | `String` | `LocalDate` (array `[y,mo,d]`) | Same Jackson behaviour |
| `contact.deliveryDate` | `Date` | `LocalDate` | |
| `contact.conceptionDate` | `Date` | `LocalDate` | |

If date fields display as arrays `[2024,3,15]` instead of formatted strings, add a date pipe or configure Jackson's `JavaTimeModule` on the backend to serialise as ISO strings.

## Routing

All 14 routes live under `DefaultComponent` behind `AuthGuard`. The `login` route is public. There is no lazy loading — all modules are eagerly loaded.

## Styles

- Global styles: `src/styles.scss`
- Component styles: each component has its own `.scss` file (ViewEncapsulation.Emulated)
- Theme: Angular Material Indigo-Pink (`@angular/material/prebuilt-themes/indigo-pink.css`)
- PrimeNG theme: nova (`primeng/resources/themes/nova/theme.css`)
- CSS variables used for theming (`--primary-color`, `--text-primary`, etc.) — defined inline in component scss files, not a single root `:root {}` block

## Security notes

- JWT is stored in `localStorage` (XSS risk; consider `HttpOnly` cookies for production)
- No CSRF protection (acceptable for JWT-based APIs that don't use cookies)
- SSL bypass in the backend's `CategoryResultServiceImpl` when calling RapidPro is intentional per deployment environment

## Git Commits

- Commit each file separately — never batch multiple files into one commit
- Write detailed commit messages that explain what changed and why (e.g. "Add UUID primary key to Role model to avoid exposing sequential IDs")
- Do not add "Co-Authored-By" lines to any commit message