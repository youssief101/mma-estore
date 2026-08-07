import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  size?: string;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private STORAGE_KEY = 'mma_estore_orders';

  createOrder(orderData: Partial<Order>): Observable<Order> {
    const orderNumber = 'MMA-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      _id: 'ord_' + Math.random().toString(36).substring(2, 9),
      orderNumber,
      items: orderData.items || [],
      shippingAddress: orderData.shippingAddress as ShippingAddress,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      discount: orderData.discount || 0,
      totalAmount: orderData.totalAmount || 0,
      status: 'Processing',
      createdAt: new Date().toISOString()
    };

    // Try API POST first
    return this.http.post<{ order: Order }>('/api/orders', orderData).pipe(
      map(res => {
        this.saveOrderToLocalStorage(res.order || newOrder);
        return res.order || newOrder;
      }),
      catchError(() => {
        // Fallback to local storage persistence
        this.saveOrderToLocalStorage(newOrder);
        return of(newOrder);
      })
    );
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>('/api/orders/my-orders').pipe(
      map(res => res.orders || []),
      catchError(() => {
        return of(this.getOrdersFromLocalStorage());
      })
    );
  }

  getOrderById(id: string): Observable<Order | null> {
    return this.http.get<{ order: Order }>(`/api/orders/${id}`).pipe(
      map(res => res.order || null),
      catchError(() => {
        const local = this.getOrdersFromLocalStorage();
        const found = local.find(o => o._id === id || o.orderNumber === id);
        return of(found || null);
      })
    );
  }

  getAllOrdersAdmin(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>('/api/orders').pipe(
      map(res => res.orders || []),
      catchError(() => {
        return of(this.getOrdersFromLocalStorage());
      })
    );
  }

  updateOrderStatusAdmin(id: string, status: Order['status']): Observable<boolean> {
    return this.http.patch(`/api/orders/${id}/status`, { status }).pipe(
      map(() => {
        this.updateLocalOrderStatus(id, status);
        return true;
      }),
      catchError(() => {
        this.updateLocalOrderStatus(id, status);
        return of(true);
      })
    );
  }

  private getOrdersFromLocalStorage(): Order[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  private saveOrderToLocalStorage(order: Order): void {
    const existing = this.getOrdersFromLocalStorage();
    const updated = [order, ...existing];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  private updateLocalOrderStatus(id: string, status: Order['status']): void {
    const existing = this.getOrdersFromLocalStorage();
    const updated = existing.map(o => o._id === id || o.orderNumber === id ? { ...o, status } : o);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
}
