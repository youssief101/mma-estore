import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);

  promoCode = '';
  discountPercent = 0;

  applyPromoCode(): void {
    const code = this.promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'UFC10' || code === 'SAVE10') {
      this.discountPercent = 10;
      this.toastService.success('Promo code applied! 10% discount added.');
    } else if (code === 'UFC20') {
      this.discountPercent = 20;
      this.toastService.success('Promo code applied! 20% discount added.');
    } else {
      this.toastService.error('Invalid promo code. Try "UFC10" or "SAVE10".');
    }
  }

  get finalDiscountAmount(): number {
    if (this.discountPercent === 0) return 0;
    return Math.round((this.cartService.subtotal() * (this.discountPercent / 100)) * 100) / 100;
  }

  get grandTotal(): number {
    const totalBefore = this.cartService.total();
    return Math.max(0, Math.round((totalBefore - this.finalDiscountAmount) * 100) / 100);
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    this.cartService.updateQuantity(item.product._id, newQty, item.selectedSize);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product._id, item.selectedSize);
  }

  getItemImage(product: any): string {
    if (!product || !product.images || product.images.length === 0) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop';
    }
    const target = product.images.find((i: any) => i.isPrimary) || product.images[0];
    const url = typeof target === 'string' ? target : target.url;
    if (!url) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop';
    return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
  }
}
