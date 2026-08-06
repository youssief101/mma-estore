import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../../../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_KEY = 'mma_cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  readonly items$ = this.itemsSubject.asObservable();

  private loadCart(): CartItem[] {
    try {
      const data = localStorage.getItem(this.CART_KEY);

      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveItems(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));

    this.itemsSubject.next(items);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(product: Product, selectedSize?: string): void {
    const items = [...this.itemsSubject.value];

    const existing = items.find(
      (item) => item.product._id === product._id && item.selectedSize === selectedSize,
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        product,
        quantity: 1,
        selectedSize,
      });
    }

    this.saveItems(items);
  }

  removeItem(productId: string, selectedSize?: string): void {
    const items = this.itemsSubject.value.filter(
      (item) => !(item.product._id === productId && item.selectedSize === selectedSize),
    );

    this.saveItems(items);
  }

  updateQuantity(productId: string, quantity: number, selectedSize?: string): void {
    if (quantity <= 0) {
      this.removeItem(productId, selectedSize);

      return;
    }

    const items = this.itemsSubject.value.map((item) => {
      if (item.product._id === productId && item.selectedSize === selectedSize) {
        return {
          ...item,
          quantity,
        };
      }

      return item;
    });

    this.saveItems(items);
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);

    this.itemsSubject.next([]);
  }

  getCount(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }
}
