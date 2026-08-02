import { Routes } from '@angular/router';

import { Home } from './features/home/pages/home/home';

import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';

import { ProductList } from './features/products/pages/product-list/product-list';
import { ProductDetails } from './features/products/pages/product-details/product-details';

import { Cart } from './features/cart/pages/cart/cart';

import { Checkout } from './features/checkout/pages/checkout/checkout';

import { Orders } from './features/orders/pages/orders/orders';

import { Profile } from './features/profile/pages/profile/profile';

import { Dashboard } from './features/admin/pages/dashboard/dashboard';

export const routes: Routes = [
   {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'products',
    component: ProductList
  },

  {
    path: 'products/:slug',
    component: ProductDetails
  },

  {
    path: 'cart',
    component: Cart
  },

  {
    path: 'checkout',
    component: Checkout
  },

  {
    path: 'orders',
    component: Orders
  },

  {
    path: 'profile',
    component: Profile
  },

  {
    path: 'admin',
    component: Dashboard
  },

  {
    path: '**',
    redirectTo: ''
  }

];
