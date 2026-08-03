import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
      path:'',
      component: AuthLayout,
      children:[
          {
              path:'login',
              component:Login
          },
          {
              path:'register',
              component:Register
          }
      ]
  }

];