import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SearchBar } from '../search-bar/search-bar';

import { NavigationService } from '../../../core/services/navigation.service';

import {
  CartService,
  CartItem,
} from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    SearchBar,
  ],

  templateUrl: './header.html',

  styleUrl: './header.css',
})
export class Header implements OnInit {
  public navigation = inject(NavigationService);

  private cartService = inject(CartService);

  cartItems: CartItem[] = [];

  cartCount = 0;

  cartTotal = 0;

  cartDrawerOpen = false;

  ngOnInit(): void {
    this.loadCart();

    this.cartService.items$.subscribe(() => {
      this.loadCart();
    });
  }

  private loadCart(): void {
    this.cartItems = this.cartService.getItems();

    this.cartCount = this.cartService.getCount();

    this.cartTotal = this.cartService.getTotal();
  }

  toggleCartDrawer(): void {
    this.cartDrawerOpen = !this.cartDrawerOpen;
  }

  closeCartDrawer(): void {
    this.cartDrawerOpen = false;
  }

  removeItem(productId: string, selectedSize?: string): void {
    this.cartService.removeItem(productId, selectedSize);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 767) {
      this.navigation.closeDrawer();
    }
  }
}
