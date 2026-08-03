import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { StoreLayout } from './layouts/store-layout/store-layout';

import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';

import { Home } from './features/home/pages/home/home';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';


export const routes: Routes = [

  {

    path: '',

    component: StoreLayout,

    children: [

      {

        path: 'home',

        component: Home

      },

      {

        path: '',

        redirectTo: 'home',

        pathMatch: 'full'

      }

    ]

  },

  {

    path: '',

    component: AuthLayout,

    canActivateChild: [

      guestGuard

    ],

    children: [

      {

        path: 'login',

        component: Login,

        canActivate: [

          guestGuard

        ]

      },

      {

        path: 'register',

        component: Register,

        canActivate: [

          guestGuard

        ]

      }

    ]

  },

  {

    path: '**',

    redirectTo: 'home'

  }

];