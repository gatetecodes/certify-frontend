import { inject } from "@angular/core";
import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  const state = auth.current;

  if (state?.accessToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${state.accessToken}`,
      },
    });
    return next(cloned);
  }

  return next(req);
}
