import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,

  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);

  const token = authService.getToken();

  let authRequest = request;

  if (token) {
    authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }

          const retryRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });

          return next(retryRequest);
        }),

        catchError((refreshError) => {
          authService.logout();

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
