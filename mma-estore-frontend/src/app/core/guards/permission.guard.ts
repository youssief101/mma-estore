import { inject } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const permissions = route.data['permissions'] as string[];

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!authService.hasAllPermissions(permissions)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
