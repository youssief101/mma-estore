import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ToastService } from './toast.service';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private toastService = inject(ToastService);
  private STORAGE_KEY = 'mma_estore_cart';

  readonly items = signal<CartItem[]>(this.loadCartFromStorage());

  readonly itemCount = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  });

  readonly shipping = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= 100 ? 0 : 10;
  });

  readonly tax = computed(() => {
    return Math.round(this.subtotal() * 0.08 * 100) / 100;
  });

  readonly total = computed(() => {
    return Math.round((this.subtotal() + this.shipping() + this.tax()) * 100) / 100;
  });

  private loadCartFromStorage(): CartItem[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }

  addToCart(product: Product, quantity = 1, selectedSize = 'M'): void {
    if (!product || !product._id) return;

    this.items.update(current => {
      const existingIndex = current.findIndex(
        i => i.product._id === product._id && i.selectedSize === selectedSize
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
      } else {
        updated = [...current, { product, quantity, selectedSize }];
      }

      this.saveCartToStorage(updated);
      return updated;
    });

    this.toastService.success(`Added "${product.name}" to cart!`);
  }

  removeFromCart(productId: string, selectedSize?: string): void {
    this.items.update(current => {
      const updated = current.filter(
        i => !(i.product._id === productId && (selectedSize ? i.selectedSize === selectedSize : true))
      );
      this.saveCartToStorage(updated);
      return updated;
    });
    this.toastService.info('Item removed from cart');
  }

  updateQuantity(productId: string, quantity: number, selectedSize?: string): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, selectedSize);
      return;
    }

    this.items.update(current => {
      const updated = current.map(item => {
        if (item.product._id === productId && (!selectedSize || item.selectedSize === selectedSize)) {
          return { ...item, quantity };
        }
        return item;
      });
      this.saveCartToStorage(updated);
      return updated;
    });
  }

  clearCart(): void {
    this.items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
