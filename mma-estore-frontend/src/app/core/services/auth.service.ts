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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);




  private apiUrl = 'http://localhost:3000/api/auth';


  private currentUserSignal = signal<User | null>(null);

  currentUser(): User | null {
    return this.currentUserSignal();
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.token);

        this.currentUserSignal.set(response.user);
      }),
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.token);

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
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return user.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
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

    this.currentUserSignal.set(null);
  }

  logout(): void {
    this.clearSession();
  }
}
