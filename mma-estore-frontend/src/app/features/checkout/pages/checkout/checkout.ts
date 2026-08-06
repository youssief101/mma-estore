import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CartService,
  CartItem,
} from '../../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
  ],

  templateUrl: './checkout.html',

  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);

  private router = inject(Router);

  items: CartItem[] = [];

  totalItems = 0;

  totalPrice = 0;

  firstName = '';

  lastName = '';

  email = '';

  phone = '';

  address = '';

  city = '';

  state = '';

  zipCode = '';

  country = '';

  paymentMethod = 'card';

  ngOnInit(): void {
    this.items = this.cartService.getItems();

    this.totalItems = this.cartService.getCount();

    this.totalPrice = this.cartService.getTotal();
  }

  placeOrder(): void {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.address ||
      !this.city ||
      !this.country
    ) {
      alert('Please complete all required fields.');

      return;
    }

    alert('Order placed successfully!');

    this.cartService.clearCart();

    this.router.navigate(['/']);
  }
}
