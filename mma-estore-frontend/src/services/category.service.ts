import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

import {
  Category,
  CategoryListResponse,
  CategoryResponse,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/categories`;

  /**
   * GET /categories
   */
  getAllCategories(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(this.apiUrl);
  }

  /**
   * GET /categories/:categoryId
   */
  getCategoryById(categoryId: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(
      `${this.apiUrl}/${categoryId}`
    );
  }

  /**
   * POST /categories
   */
  createCategory(
    category: Partial<Category>
  ): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(
      this.apiUrl,
      category
    );
  }

  /**
   * PUT /categories/:categoryId
   */
  updateCategory(
    categoryId: string,
    category: Partial<Category>
  ): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(
      `${this.apiUrl}/${categoryId}`,
      category
    );
  }

  /**
   * DELETE /categories/:categoryId
   */
  deleteCategory(categoryId: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${categoryId}`);
  }
}