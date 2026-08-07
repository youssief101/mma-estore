import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavCategory {
  title: string;
  link: string;
  queryParams?: Record<string, any>;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  categories: NavCategory[] = [
    {
      title: 'UFC Venum',
      link: '/products',
      queryParams: { brand: 'Venum' }
    },
    {
      title: 'Fighters',
      link: '/fighters'
    },
    {
      title: 'Events',
      link: '/events'
    },
    {
      title: 'Apparel',
      link: '/products',
      queryParams: { category: 'Apparel' }
    },
    {
      title: 'T-Shirts',
      link: '/products',
      queryParams: { category: 'T-Shirts' }
    },
    {
      title: 'Hats',
      link: '/products',
      queryParams: { category: 'Hats' }
    },
    {
      title: 'Equipment',
      link: '/products',
      queryParams: { category: 'Equipment' }
    },
    {
      title: 'Replica Belts',
      link: '/products',
      queryParams: { category: 'Replica Belts' }
    },
    {
      title: 'Collectibles',
      link: '/products',
      queryParams: { category: 'Collectibles' }
    },
    {
      title: 'Home & Office',
      link: '/products',
      queryParams: { category: 'Home & Office' }
    },
    {
      title: 'Sale',
      link: '/products',
      queryParams: { onSale: 'true' }
    }
  ];
}