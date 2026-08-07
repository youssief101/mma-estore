import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { StoreLayout } from './layouts/store-layout/store-layout';

import { Login } from './features/auth/pages/login/login';
import { RegisterPage } from './features/auth/pages/register/register-page';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/pages/reset-password/reset-password';
import { Home } from './features/home/pages/home/home';
import { Profile } from './features/profile/pages/profile/profile';
import { ProductList } from './features/products/pages/product-list/product-list';
import { ProductDetails } from './features/products/pages/product-details/product-details';
import { Fighters } from './features/fighters/fighters';
import { Cart } from './features/cart/pages/cart/cart';
import { Checkout } from './features/checkout/pages/checkout/checkout';
import { Orders } from './features/orders/pages/orders/orders';
import { GiftCards } from './features/gift-cards/gift-cards';
import { Help } from './features/help/help';
import { Dashboard as AdminDashboard } from './features/admin/pages/dashboard/dashboard';
import { TestApiComponent } from '../app/pages/test-api/test-api';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

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
        path: 'products',
        component: ProductList,
      },
      {
        path: 'products/:id',
        component: ProductDetails,
      },
      {
        path: 'fighters',
        component: Fighters,
      },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: 'checkout',
        component: Checkout,
      },
      {
        path: 'orders',
        component: Orders,
      },
      {
        path: 'orders/:id',
        component: Orders,
      },
      {
        path: 'gift-cards',
        component: GiftCards,
      },
      {
        path: 'help',
        component: Help,
      },
      {
        path: 'admin',
        component: AdminDashboard,
        canActivate: [adminGuard],
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard],
      },
      {
        path: 'account',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
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
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
      {
        path: 'reset-password',
        component: ResetPassword,
      },
    ],
  },
  {
    path: 'test-api',
    component: TestApiComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
