import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Brand,
  BrandListResponse,
  BrandResponse,
} from '../models/brand.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/brands`;

  /**
   * GET /brands
   */
  getAllBrands(): Observable<BrandListResponse> {
    return this.http.get<BrandListResponse>(this.apiUrl);
  }

  /**
   * GET /brands/:brandId
   */
  getBrandById(brandId: string): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(
      `${this.apiUrl}/${brandId}`
    );
  }

  /**
   * POST /brands
   */
  createBrand(
    brand: Partial<Brand>
  ): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(
      this.apiUrl,
      brand
    );
  }

  /**
   * PUT /brands/:brandId
   */
  updateBrand(
    brandId: string,
    brand: Partial<Brand>
  ): Observable<BrandResponse> {
    return this.http.put<BrandResponse>(
      `${this.apiUrl}/${brandId}`,
      brand
    );
  }

  /**
   * DELETE /brands/:brandId
   */
  deleteBrand(brandId: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${brandId}`);
  }
}