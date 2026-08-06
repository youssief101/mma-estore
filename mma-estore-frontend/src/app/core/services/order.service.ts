import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/orders`;

  createOrder(order: any): Observable<any> {
    return this.http.post(this.api, order);
  }

  getMyOrders(): Observable<any> {
    return this.http.get(`${this.api}/my-orders`);
  }

  getOrder(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }
}
