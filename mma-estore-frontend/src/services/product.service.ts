import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "../environments/environment";

import {
  Product,
  ProductListResponse,
  ProductResponse
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private readonly api = `${environment.apiUrl}/products`;

  getAllProducts(
    page = 1,
    limit = 10
  ): Observable<ProductListResponse> {

    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<ProductListResponse>(
      this.api,
      { params }
    );
  }

  getProduct(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.api}/${id}`
    );
  }

  searchProducts(query: string): Observable<ProductListResponse> {

    return this.http.get<ProductListResponse>(
      `${this.api}/search`,
      {
        params: {
          q: query
        }
      }
    );
  }

  filterProducts(filters: Record<string, any>): Observable<ProductListResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // value might be "id1,id2", HttpParams handles this as a string correctly
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ProductListResponse>(
      `${this.api}/filter`,
      { params }
    );
  }

  getFeaturedProducts(): Observable<ProductListResponse> {

    return this.http.get<ProductListResponse>(
      `${this.api}/featured`
    );
  }

  getChampionGear(): Observable<ProductListResponse> {

    return this.http.get<ProductListResponse>(
      `${this.api}/champion-gear`
    );
  }

  getNewArrivals(): Observable<ProductListResponse> {

    return this.http.get<ProductListResponse>(
      `${this.api}/new-arrivals`
    );
  }

  getRelatedProducts(id: string): Observable<ProductListResponse> {

    return this.http.get<ProductListResponse>(
      `${this.api}/${id}/related`
    );
  }

  createProduct(product: Partial<Product>): Observable<ProductResponse> {

    return this.http.post<ProductResponse>(
      this.api,
      product
    );
  }

  updateProduct(
    id: string,
    product: Partial<Product>
  ): Observable<ProductResponse> {

    return this.http.put<ProductResponse>(
      `${this.api}/${id}`,
      product
    );
  }

  deleteProduct(id: string): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`
    );
  }

}