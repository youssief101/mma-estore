import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-gift-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gift-cards.html',
  styleUrl: './gift-cards.css',
})
export class GiftCards {
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  selectedAmount = 50;
  customAmount = 0;
  recipientName = '';
  recipientEmail = '';
  senderName = '';
  message = '';

  checkCode = '';
  checkResult: { valid: boolean; balance?: number; message?: string } | null = null;

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  get finalAmount(): number {
    return this.selectedAmount === -1 ? (this.customAmount || 10) : this.selectedAmount;
  }

  addGiftCardToCart(): void {
    if (!this.recipientEmail) {
      this.toastService.error('Please enter recipient email address.');
      return;
    }

    const giftCardProduct: any = {
      _id: 'gc_' + Math.random().toString(36).substring(2, 9),
      name: `MMA Official E-Gift Card ($${this.finalAmount})`,
      price: this.finalAmount,
      images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop', isPrimary: true }]
    };

    this.cartService.addToCart(giftCardProduct, 1, `$${this.finalAmount}`);
    this.toastService.success(`Added $${this.finalAmount} E-Gift Card to your cart!`);
  }

  verifyBalance(): void {
    const code = this.checkCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'GIFT-25' || code === 'MMA25') {
      this.checkResult = { valid: true, balance: 25.00 };
    } else if (code === 'GIFT-50' || code === 'MMA50') {
      this.checkResult = { valid: true, balance: 50.00 };
    } else if (code === 'GIFT-100' || code === 'MMA100') {
      this.checkResult = { valid: true, balance: 100.00 };
    } else {
      this.checkResult = { valid: false, message: 'Invalid gift card code or code has expired.' };
    }
  }
}
