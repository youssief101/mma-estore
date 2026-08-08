import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CartService } from '../../../../core/services/cart.service';
import { OrderService, ShippingAddress } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

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
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
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

    let hasGiftCard = false;
    const generatedGcCodes: string[] = [];

    const orderItems = this.cartService.items().map(item => {
      const isGiftCard = (item.product as any).isGiftCard || 
        item.product.name.toLowerCase().includes('gift card') || 
        item.product._id?.startsWith('gc_');

      let gcCode: string | undefined = undefined;

      if (isGiftCard) {
        hasGiftCard = true;
        gcCode = (item.product as any).giftCardDetails?.code || 'MMA-GC' + Math.random().toString(36).substring(2, 8).toUpperCase();
        if (gcCode) generatedGcCodes.push(gcCode);

        // Issue and persist active gift card in DB immediately upon checkout!
        const gcPayload = {
          code: gcCode,
          amount: item.product.price,
          recipientEmail: (item.product as any).giftCardDetails?.recipientEmail || this.shipping.email,
          recipientName: (item.product as any).giftCardDetails?.recipientName || `${this.shipping.firstName} ${this.shipping.lastName}`,
          senderName: (item.product as any).giftCardDetails?.senderName || `${this.shipping.firstName} ${this.shipping.lastName}`,
          message: (item.product as any).giftCardDetails?.message || 'Purchased via MMA E-Store Checkout'
        };

        const token = this.authService.getToken();
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }

        this.http.post<any>(`${environment.apiUrl}/giftcards`, gcPayload, { headers }).subscribe({
          next: () => {},
          error: () => {}
        });

        // Save to local storage for instant fallback availability
        try {
          const stored = JSON.parse(localStorage.getItem('mma_estore_issued_giftcards') || '[]');
          stored.unshift({ ...gcPayload, isActive: true, createdAt: new Date().toISOString() });
          localStorage.setItem('mma_estore_issued_giftcards', JSON.stringify(stored));
        } catch {}
      }

      return {
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0]?.url || '/giftCards/giftCard.png',
          giftCardCode: gcCode
        },
        quantity: item.quantity,
        size: item.selectedSize,
        price: item.product.price,
        giftCardCode: gcCode
      };
    });

    const orderData: any = {
      items: orderItems,
      shippingAddress: this.shipping,
      paymentMethod: this.paymentMethod === 'credit' ? 'Credit Card' : this.paymentMethod.toUpperCase(),
      subtotal: this.cartService.subtotal(),
      shipping: this.cartService.shipping(),
      tax: this.cartService.tax(),
      totalAmount: this.cartService.total(),
      status: hasGiftCard ? 'Delivered' : 'Processing' // Digital Gift Card delivered immediately as completed purchase
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        this.cartService.clearCart();
        if (hasGiftCard) {
          this.toastService.success(`🎉 Order #${order.orderNumber} completed! Gift Card Code (${generatedGcCodes[0] || 'Active'}) issued!`);
        } else {
          this.toastService.success(`Order #${order.orderNumber} placed successfully!`);
        }
        this.router.navigate(['/orders', order._id]);
      },
      error: () => {
        this.isSubmitting = false;
        this.toastService.error('Failed to place order. Please try again.');
      }
    });
  }
}
