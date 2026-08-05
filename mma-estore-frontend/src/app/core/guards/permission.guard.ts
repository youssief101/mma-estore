import { inject } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const permissions = route.data['permissions'] as string[];

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);

    return false;
  }

  if (!authService.hasAllPermissions(permissions)) {
    router.navigate(['/unauthorized']);

    return false;
  }

  return true;
};
