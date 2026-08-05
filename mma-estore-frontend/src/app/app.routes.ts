import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { StoreLayout } from './layouts/store-layout/store-layout';

import { Login } from './features/auth/pages/login/login';
import { Home } from './features/home/pages/home/home';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Unauthorized } from './features/errors/pages/unauthorized/unauthorized';

import { adminGuard } from './core/guards/admin.guard';

import { roleGuard } from './core/guards/role.guard';

import { permissionGuard } from './core/guards/permission.guard';
import { Profile } from './features/profile/pages/profile/profile';
import { TestApiComponent } from '../app/pages/test-api/test-api';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayout,

    children: [
      {
        path: 'home',
        component: Home,
      },

      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard],
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      /*
      Example protected pages:

      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile')
            .then(m => m.Profile),
        canActivate: [authGuard],
      },

      {
        path: 'admin',
        loadComponent: () =>
          import('./features/admin/pages/admin/admin')
            .then(m => m.Admin),
        canActivate: [adminGuard],
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/products/products')
            .then(m => m.Products),
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager'],
        },
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/pages/orders/orders')
            .then(m => m.Orders),
        canActivate: [permissionGuard],
        data: {
          permissions: [
            'orders.view',
            'orders.manage',
          ],
        },
      },
      */
    ],
  },

  {
    path: '',
    component: AuthLayout,

    canActivateChild: [guestGuard],

    children: [
      {
        path: 'login',
        component: Login,
      },
    ],
  },
  
  {
    path: 'test-api',
    component: TestApiComponent
  },
  {
    path: '**',
    redirectTo: 'home',
  }

];
