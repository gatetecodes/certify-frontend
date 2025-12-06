import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Auto logout if 401 Unauthorized returned from API
        auth.logout();
      }
      return throwError(() => error);
    })
  );
}
