import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Don't attach token to auth endpoints
  if (
    request.url.includes('/auth/login') ||
    request.url.includes('/auth/register')
  ) {
    return next(request);
  }

  const token = authService.getToken();

  const authRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : request;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSession();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};