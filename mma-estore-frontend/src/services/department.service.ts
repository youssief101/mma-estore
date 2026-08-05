import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Department,
  DepartmentListResponse,
  DepartmentResponse,
} from '../models/department.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/departments`;

  /**
   * GET /departments
   */
  getAllDepartments(): Observable<DepartmentListResponse> {
    return this.http.get<DepartmentListResponse>(this.apiUrl);
  }

  /**
   * GET /departments/:departmentId
   */
  getDepartmentById(
    departmentId: string
  ): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(
      `${this.apiUrl}/${departmentId}`
    );
  }

  /**
   * POST /departments
   */
  createDepartment(
    department: Partial<Department>
  ): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(
      this.apiUrl,
      department
    );
  }

  /**
   * PUT /departments/:departmentId
   */
  updateDepartment(
    departmentId: string,
    department: Partial<Department>
  ): Observable<DepartmentResponse> {
    return this.http.put<DepartmentResponse>(
      `${this.apiUrl}/${departmentId}`,
      department
    );
  }

  /**
   * DELETE /departments/:departmentId
   */
  deleteDepartment(
    departmentId: string
  ): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${departmentId}`);
  }
}