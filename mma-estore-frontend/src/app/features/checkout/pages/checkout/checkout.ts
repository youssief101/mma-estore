import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  CartService,
  CartItem,
} from '../../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);

  private cartService = inject(CartService);

  cartItems: CartItem[] = [];

  subtotal = 0;

  shipping = 0;

  total = 0;

  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', Validators.required],

    address: ['', Validators.required],

    city: ['', Validators.required],

    country: ['', Validators.required],

    postalCode: ['', Validators.required],

    paymentMethod: ['card', Validators.required],
  });

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;

      this.subtotal = this.cartService.getTotal();

      this.shipping = 0;

      this.total = this.subtotal + this.shipping;
    });
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    console.log(this.checkoutForm.value);

    console.log(this.cartItems);
  }
}
