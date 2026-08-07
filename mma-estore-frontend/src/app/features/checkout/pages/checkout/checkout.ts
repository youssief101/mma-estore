import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import { OrderService, ShippingAddress } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  isSubmitting = false;
  sameAsShipping = true;
  paymentMethod: 'credit' | 'paypal' | 'apple' = 'credit';

  shipping: ShippingAddress = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  };

  card = {
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  placeOrder(): void {
    if (this.cartService.items().length === 0) {
      this.toastService.error('Your cart is empty!');
      return;
    }

    if (!this.shipping.firstName || !this.shipping.lastName || !this.shipping.email || !this.shipping.address) {
      this.toastService.error('Please fill in all required shipping address fields.');
      return;
    }

    if (this.paymentMethod === 'credit' && (!this.card.cardNumber || !this.card.expiry || !this.card.cvv)) {
      this.toastService.error('Please enter valid credit card details.');
      return;
    }

    this.isSubmitting = true;

    const orderItems = this.cartService.items().map(item => ({
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0]?.url
      },
      quantity: item.quantity,
      size: item.selectedSize,
      price: item.product.price
    }));

    const orderData = {
      items: orderItems,
      shippingAddress: this.shipping,
      paymentMethod: this.paymentMethod === 'credit' ? 'Credit Card' : this.paymentMethod.toUpperCase(),
      subtotal: this.cartService.subtotal(),
      shipping: this.cartService.shipping(),
      tax: this.cartService.tax(),
      totalAmount: this.cartService.total(),
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        this.cartService.clearCart();
        this.toastService.success(`Order #${order.orderNumber} placed successfully!`);
        this.router.navigate(['/orders', order._id]);
      },
      error: () => {
        this.isSubmitting = false;
        this.toastService.error('Failed to place order. Please try again.');
      }
    });
  }
}
