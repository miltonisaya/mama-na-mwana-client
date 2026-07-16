import {Injectable} from '@angular/core';
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from '../components/loader/loader.service';
import {finalize} from 'rxjs/operators';

/**
 * Set to true in a request's HttpContext to exclude it from the app-wide blocking
 * loader overlay — for requests that are expected to run long (e.g. an LLM round trip)
 * where freezing the whole UI for the duration would be wrong. The request still
 * completes normally; only the global overlay is skipped, so callers should show their
 * own local loading state.
 */
export const SKIP_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(SKIP_GLOBAL_LOADER)) {
      return next.handle(request);
    }

    this.loaderService.isLoading.next(true);
    return next.handle(request).pipe(
      finalize(
        () => {
          this.loaderService.isLoading.next(false);
        }
      )
    );
  }
}
