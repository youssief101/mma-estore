import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  }

  refreshCart(): void {
    this.items = this.cartService.getItems();
    this.totalItems = this.cartService.getTotalItems();
    this.totalPrice = this.cartService.getTotal();
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity + 1, item.selectedSize);
    this.refreshCart();
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity - 1, item.selectedSize);
    this.refreshCart();
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product._id, item.selectedSize);
    this.refreshCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.refreshCart();
  }

  getImageUrl(url?: string): string {
    if (!url) return 'assets/images/no-image.png';
    if (url.startsWith('http')) return url;
    const parts = url.split('/');
    let filename = parts[parts.length - 1];
    if (filename.toLowerCase().endsWith('.png')) {
      filename = filename.slice(0, -4) + '.jpg';
    }
    return `/products/${filename}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image.png';
  }

  trackByItem(index: number, item: CartItem): string {
    return `${item.product._id}-${item.selectedSize || 'no-size'}`;
  }
}
