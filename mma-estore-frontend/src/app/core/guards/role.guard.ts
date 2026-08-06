import { inject } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const roles = route.data['roles'] as string[];

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!authService.hasAnyRole(roles)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
