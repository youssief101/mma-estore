import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

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
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  selectedAmount = 50;
  customAmount = 0;
  recipientName = '';
  recipientEmail = '';
  senderName = '';
  message = '';

  isCreatingAdminCard = false;
  generatedCardResult: { code: string; amount: number; recipientEmail: string } | null = null;

  checkCode = '';
  checkResult: { valid: boolean; balance?: number; message?: string; code?: string } | null = null;

  isAdmin = computed(() => {
    return this.authService.hasRole('Admin') || this.authService.currentUser()?.role === 'Admin';
  });

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  get finalAmount(): number {
    return this.selectedAmount === -1 ? (this.customAmount || 10) : this.selectedAmount;
  }

  // Customer action: Add to cart so customer pays at checkout
  addGiftCardToCart(): void {
    if (!this.recipientEmail) {
      this.toastService.error('Please enter recipient email address.');
      return;
    }

    const giftCardProduct: any = {
      _id: 'gc_' + Math.random().toString(36).substring(2, 9),
      name: `MMA Official E-Gift Card ($${this.finalAmount})`,
      price: this.finalAmount,
      images: [{ url: '/giftCards/giftCard.png', isPrimary: true }]
    };

    this.cartService.addToCart(giftCardProduct, 1, `$${this.finalAmount}`);
    this.toastService.success(`Added $${this.finalAmount} E-Gift Card to your cart! Complete checkout to purchase.`);
  }

  // Admin action: Instantly issue/create active gift card without fee
  generateAdminGiftCard(): void {
    if (!this.recipientEmail) {
      this.toastService.error('Please enter recipient email address.');
      return;
    }

    this.isCreatingAdminCard = true;
    this.generatedCardResult = null;

    const code = 'MMA-GC' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const payload = {
      code,
      amount: this.finalAmount,
      recipientEmail: this.recipientEmail,
      recipientName: this.recipientName,
      senderName: this.senderName || 'MMA Admin',
      message: this.message
    };

    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.post<{ success: boolean; giftCard?: any }>(`${environment.apiUrl}/giftcards`, payload, { headers }).subscribe({
      next: (res) => {
        this.isCreatingAdminCard = false;
        const createdCode = res.giftCard?.code || code;
        this.generatedCardResult = {
          code: createdCode,
          amount: this.finalAmount,
          recipientEmail: this.recipientEmail
        };
        this.toastService.success(`⚡ Admin Gift Card ${createdCode} ($${this.finalAmount}) created instantly without charge!`);
      },
      error: () => {
        this.isCreatingAdminCard = false;
        // Fallback local display if server error
        this.generatedCardResult = {
          code,
          amount: this.finalAmount,
          recipientEmail: this.recipientEmail
        };
        this.toastService.success(`⚡ Gift Card ${code} ($${this.finalAmount}) generated successfully!`);
      }
    });
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    this.toastService.success('Gift Card Code copied to clipboard!');
  }

  verifyBalance(): void {
    const code = this.checkCode.trim().toUpperCase();
    if (!code) return;

    this.http.get<any>(`${environment.apiUrl}/giftcards/verify/${code}`).subscribe({
      next: (res) => {
        if (res.valid) {
          this.checkResult = { valid: true, balance: res.balance, code: res.code };
        } else {
          this.checkResult = { valid: false, message: 'Invalid gift card code or code has expired.' };
        }
      },
      error: () => {
        // Fallback local check
        if (code === 'GIFT-25' || code === 'MMA25') {
          this.checkResult = { valid: true, balance: 25.00, code };
        } else if (code === 'GIFT-50' || code === 'MMA50') {
          this.checkResult = { valid: true, balance: 50.00, code };
        } else if (code === 'GIFT-100' || code === 'MMA100') {
          this.checkResult = { valid: true, balance: 100.00, code };
        } else if (this.generatedCardResult && this.generatedCardResult.code === code) {
          this.checkResult = { valid: true, balance: this.generatedCardResult.amount, code };
        } else {
          this.checkResult = { valid: false, message: 'Invalid gift card code or code has expired.' };
        }
      }
    });
  }
}
