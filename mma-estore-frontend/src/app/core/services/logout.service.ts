import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private authService = inject(AuthService);

  private router = inject(Router);

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}