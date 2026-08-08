import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    giftCardCode?: string;
  };
  quantity: number;
  size?: string;
  price: number;
  giftCardCode?: string;
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
  userId?: string;
  userEmail?: string;
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
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/orders`;
  private STORAGE_KEY = 'mma_estore_orders';

  createOrder(orderData: Partial<Order>): Observable<Order> {
    const currentUser = this.authService.currentUser();
    const userId = currentUser?.id || currentUser?._id;
    const userEmail = currentUser?.email || orderData.shippingAddress?.email;

    const orderNumber = 'MMA-' + Math.floor(100000 + Math.random() * 900000);
    const rawOrder = {
      _id: 'ord_' + Math.random().toString(36).substring(2, 9),
      orderNumber,
      userId,
      userEmail,
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

    const normalized = this.normalizeOrder(rawOrder);

    // Try API POST first
    return this.http.post<{ order: Order }>(this.apiUrl, orderData).pipe(
      map(res => {
        const savedOrder = this.normalizeOrder(res.order || normalized);
        this.saveOrderToLocalStorage(savedOrder);
        return savedOrder;
      }),
      catchError(() => {
        // Fallback to local storage persistence
        this.saveOrderToLocalStorage(normalized);
        return of(normalized);
      })
    );
  }

  getUserOrders(): Observable<Order[]> {
    const currentUser = this.authService.currentUser();
    const userId = currentUser?.id || currentUser?._id;
    const userEmail = currentUser?.email?.toLowerCase();

    return this.http.get<{ orders: any[] }>(`${this.apiUrl}/my-orders`).pipe(
      map(res => {
        const rawList = res.orders || [];
        const normalized = rawList.map(o => this.normalizeOrder(o));
        if (userId || userEmail) {
          return normalized.filter(o => 
            (userId && o.userId === userId) ||
            (userEmail && o.userEmail?.toLowerCase() === userEmail) ||
            (userEmail && o.shippingAddress?.email?.toLowerCase() === userEmail)
          );
        }
        return normalized;
      }),
      catchError(() => {
        const local = this.getOrdersFromLocalStorage();
        if (userId || userEmail) {
          return of(local.filter(o => 
            (userId && o.userId === userId) ||
            (userEmail && o.userEmail?.toLowerCase() === userEmail) ||
            (userEmail && o.shippingAddress?.email?.toLowerCase() === userEmail)
          ));
        }
        return of(local);
      })
    );
  }

  getOrderById(id: string): Observable<Order | null> {
    return this.http.get<{ order: any }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.order ? this.normalizeOrder(res.order) : null),
      catchError(() => {
        const local = this.getOrdersFromLocalStorage();
        const found = local.find(o => o._id === id || o.orderNumber === id);
        return of(found || null);
      })
    );
  }

  getAllOrdersAdmin(): Observable<Order[]> {
    return this.http.get<{ orders: any[] }>(this.apiUrl).pipe(
      map(res => (res.orders || []).map(o => this.normalizeOrder(o))),
      catchError(() => {
        return of(this.getOrdersFromLocalStorage());
      })
    );
  }

  updateOrderStatusAdmin(id: string, status: Order['status']): Observable<boolean> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { orderStatus: status, status }).pipe(
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

  private normalizeOrder(o: any): Order {
    if (!o) return {} as Order;

    const status = o.status || o.orderStatus || 'Processing';
    const totalAmount = typeof o.totalAmount === 'number' ? o.totalAmount : (typeof o.total === 'number' ? o.total : 0);
    const subtotal = typeof o.subtotal === 'number' ? o.subtotal : totalAmount;
    const shipping = typeof o.shipping === 'number' ? o.shipping : 0;
    const tax = typeof o.tax === 'number' ? o.tax : 0;
    const discount = typeof o.discount === 'number' ? o.discount : 0;

    let shippingAddress = o.shippingAddress || {};
    if (typeof shippingAddress === 'string') {
      shippingAddress = { address: shippingAddress };
    }

    const firstName = shippingAddress.firstName || (shippingAddress.fullName ? shippingAddress.fullName.split(' ')[0] : (o.userID?.firstName || 'Customer'));
    const lastName = shippingAddress.lastName || (shippingAddress.fullName ? shippingAddress.fullName.split(' ').slice(1).join(' ') : (o.userID?.lastName || ''));

    const normAddress: ShippingAddress = {
      firstName,
      lastName,
      email: shippingAddress.email || o.userID?.email || o.userEmail || '',
      phone: shippingAddress.phone || '',
      address: shippingAddress.address || shippingAddress.street || 'Standard Delivery',
      city: shippingAddress.city || 'N/A',
      state: shippingAddress.state || shippingAddress.governorate || 'N/A',
      zipCode: shippingAddress.zipCode || shippingAddress.postalCode || '00000',
      country: shippingAddress.country || 'USA'
    };

    const rawItems = Array.isArray(o.items) ? o.items : [];
    const items = rawItems.map((it: any) => {
      let prod = it.product || it.productID;
      const gcCode = it.giftCardCode || it.product?.giftCardCode || (typeof prod === 'object' ? prod?.giftCardCode : undefined);

      if (typeof prod === 'string' || !prod) {
        prod = {
          _id: typeof prod === 'string' ? prod : (it._id || 'prod_1'),
          name: it.productName || it.name || 'UFC Gear Item',
          price: it.price || 0,
          image: it.image || (it.images && it.images[0]?.url) || '/giftCards/giftCard.png',
          giftCardCode: gcCode
        };
      } else {
        prod = {
          _id: prod._id || 'prod_1',
          name: prod.name || it.productName || 'UFC Gear Item',
          price: prod.price || it.price || 0,
          image: prod.image || (prod.images && prod.images[0]?.url) || '/giftCards/giftCard.png',
          giftCardCode: gcCode || prod.giftCardCode
        };
      }

      return {
        product: prod,
        quantity: it.quantity || 1,
        size: it.size || 'M',
        price: it.price || prod.price || 0,
        giftCardCode: gcCode
      };
    });

    return {
      _id: o._id || ('ord_' + Math.random().toString(36).substring(2, 9)),
      orderNumber: o.orderNumber ? String(o.orderNumber) : ('MMA-' + Math.floor(100000 + Math.random() * 900000)),
      userId: o.userId || (typeof o.userID === 'object' ? o.userID?._id : o.userID),
      userEmail: o.userEmail || (typeof o.userID === 'object' ? o.userID?.email : undefined) || normAddress.email,
      items,
      shippingAddress: normAddress,
      paymentMethod: o.paymentMethod || o.payment?.method || 'Credit Card',
      subtotal,
      shipping,
      tax,
      discount,
      totalAmount,
      status,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
    };
  }

  private getOrdersFromLocalStorage(): Order[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      return list.map((o: any) => this.normalizeOrder(o));
    } catch (e) {
      return [];
    }
  }

  private saveOrderToLocalStorage(order: Order): void {
    const existing = this.getOrdersFromLocalStorage();
    const updated = [order, ...existing.filter(o => o._id !== order._id && o.orderNumber !== order.orderNumber)];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  private updateLocalOrderStatus(id: string, status: Order['status']): void {
    const existing = this.getOrdersFromLocalStorage();
    const updated = existing.map(o => o._id === id || o.orderNumber === id ? { ...o, status } : o);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }
}
