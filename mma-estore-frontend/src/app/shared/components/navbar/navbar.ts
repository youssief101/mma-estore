import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  categories = [

    {
      title: 'UFC Venum',
      link: '/venum'
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
      link: '/products/apparel'
    },

    {
      title: 'T-Shirts',
      link: '/products/t-shirts'
    },

    {
      title: 'Hats',
      link: '/products/hats'
    },

    {
      title: 'Equipment',
      link: '/products/equipment'
    },

    {
      title: 'Replica Belts',
      link: '/products/replica-belts'
    },

    {
      title: 'Collectibles',
      link: '/products/collectibles'
    },

    {
      title: 'Home & Office',
      link: '/products/home-office'
    },

    {
      title: 'Sale',
      link: '/sale'
    }

  ];

}