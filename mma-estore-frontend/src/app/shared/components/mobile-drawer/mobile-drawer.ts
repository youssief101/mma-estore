import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './mobile-drawer.html',
  styleUrl: './mobile-drawer.css',
})
export class MobileDrawer {
  @Input() open = false;

  readonly authService = inject(AuthService);

  constructor(public navigation: NavigationService) {}

  readonly categories = [
    { title: 'UFC', link: '/products' },
    { title: 'Venum', link: '/venum' },
    { title: 'Fighters', link: '/fighters' },
    { title: 'Events', link: '/events' },
    { title: 'T-Shirts', link: '/t-shirts' },
    { title: 'Hats', link: '/hats' },
    { title: 'Equipment', link: '/equipment' },
    { title: 'Sale', link: '/sale' },
  ];
}
