import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CurrentUserResponse,
} from '../models/auth.models';

import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(null);

  currentUser(): User | null {
    return this.currentUserSignal();
  }

  saveToken(token: string, rememberMe: boolean = true): void {
    if (rememberMe) {
      localStorage.setItem('accessToken', token);
      sessionStorage.removeItem('accessToken');
    } else {
      sessionStorage.setItem('accessToken', token);
      localStorage.removeItem('accessToken');
    }
  }

  login(payload: LoginRequest & { rememberMe?: boolean }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        this.saveToken(response.token, payload.rememberMe !== false);
        this.currentUserSignal.set(response.user);
      }),
    );
  }

  socialLogin(provider: string, rememberMe: boolean = true): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/social-login`, { provider }).pipe(
      tap((response) => {
        this.saveToken(response.token, rememberMe);
        this.currentUserSignal.set(response.user);
      }),
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        this.saveToken(response.token, true);
        this.currentUserSignal.set(response.user);
      }),
    );
  }

  loadCurrentUser(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        this.currentUserSignal.set(response.user);
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();

    if (!user || !user.role) {
      return false;
    }

    return user.role.toLowerCase() === role.toLowerCase();
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();

    if (!user || !user.role) {
      return false;
    }

    const lowerRoles = roles.map((r) => r.toLowerCase());
    return lowerRoles.includes(user.role.toLowerCase());
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    const permissions = user.permissions ?? [];

    return permissions.includes(permission);
  }

  hasAllPermissions(permissions: string[]): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    const userPermissions = user.permissions ?? [];

    return permissions.every((permission) => userPermissions.includes(permission));
  }

  updateCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
  }

  clearSession(): void {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');

    this.currentUserSignal.set(null);
  }

  logout(): void {
    this.clearSession();
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}
