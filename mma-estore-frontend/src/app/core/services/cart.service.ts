import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'mma_cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.getItems());
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  getItems(): CartItem[] {
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

  addToCart(product: Product, selectedSize?: string): void {
    const items = this.getItems();
    const existingIndex = items.findIndex(
      item => item.product._id === product._id && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({ product, quantity: 1, selectedSize });
    }

    this.saveItems(items);
  }

  removeFromCart(productId: string, selectedSize?: string): void {
    const items = this.getItems().filter(
      item => !(item.product._id === productId && item.selectedSize === selectedSize)
    );
    this.saveItems(items);
  }

  removeItem(productId: string, selectedSize?: string): void {
    this.removeFromCart(productId, selectedSize);
  }

  updateQuantity(productId: string, quantity: number, selectedSize?: string): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, selectedSize);
      return;
    }

    const items = this.getItems().map(item => {
      if (item.product._id === productId && item.selectedSize === selectedSize) {
        return { ...item, quantity };
      }
      return item;
    });
    this.saveItems(items);
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    this.itemsSubject.next([]);
  }

  getTotalItems(): number {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getCount(): number {
    return this.getTotalItems();
  }

  getTotal(): number {
    return this.getItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }
}
