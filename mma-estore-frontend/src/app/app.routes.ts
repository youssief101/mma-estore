import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { StoreLayout } from './layouts/store-layout/store-layout';

import { Login } from './features/auth/pages/login/login';
import { Home } from './features/home/pages/home/home';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

import { Profile } from './features/profile/pages/profile/profile';

import { TestApiComponent } from './pages/test-api/test-api';

import { ProductList } from './features/products/pages/product-list/product-list';
import { ProductDetails } from './features/products/pages/product-details/product-details';

import { Cart } from './features/cart/pages/cart/cart';

import { CheckoutComponent } from './features/checkout/pages/checkout/checkout';
import { OrderSuccessComponent } from './features/checkout/pages/checkout/order-success/order-success';

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
        path: 'cart',
        component: Cart,
      },

      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard],
      },

      {

    path: "order-success/:orderNumber",
    loadComponent: () =>
        import("./features/orders/order-success/order-success")
            .then(m => m.OrderSuccessComponent)
},

      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard],
      },

      {
        path: 'test-api',
        component: TestApiComponent,
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
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
