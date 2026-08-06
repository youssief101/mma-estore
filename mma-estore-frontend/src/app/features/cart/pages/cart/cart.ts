import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  CartService,
  CartItem
} from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  private cartService = inject(CartService);

  items: CartItem[] = [];

  totalItems = 0;

  totalPrice = 0;

  ngOnInit(): void {
    this.refreshCart();

    this.cartService.items$.subscribe(() => {
      this.refreshCart();
    });
  }

  refreshCart(): void {

    this.items =
      this.cartService.getItems();

    this.totalItems =
      this.cartService.getCount();

    this.totalPrice =
      this.cartService.getTotal();
  }

  increaseQuantity(item: CartItem): void {

    this.cartService.updateQuantity(
      item.product._id,
      item.quantity + 1,
      item.selectedSize
    );
  }

  decreaseQuantity(item: CartItem): void {

    this.cartService.updateQuantity(
      item.product._id,
      item.quantity - 1,
      item.selectedSize
    );
  }

  removeItem(item: CartItem): void {

    this.cartService.removeItem(
      item.product._id,
      item.selectedSize
    );
  }

  clearCart(): void {

    this.cartService.clearCart();
  }

  trackByItem(
    index: number,
    item: CartItem
  ): string {

    return `${item.product._id}-${item.selectedSize || 'no-size'}`;
  }
}
