import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  CurrentUserResponse
} from '../models/auth.models';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:3000/api/auth';

  private currentUserSignal =
    signal<User | null>(null);

  currentUser() {
    return this.currentUserSignal();
  }

  login(
    payload: LoginRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        payload
      )
      .pipe(
        tap(response => {

          localStorage.setItem(
            'accessToken',
            response.accessToken
          );

          if (response.refreshToken) {

            localStorage.setItem(
              'refreshToken',
              response.refreshToken
            );

          }

        })
      );

  }

  register(
    payload: RegisterRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      payload
    );

  }

  refreshToken(): Observable<AuthResponse> {

    const refreshToken =
      localStorage.getItem('refreshToken');

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/refresh-token`,
      {
        refreshToken
      } as RefreshTokenRequest
    );

  }

  loadCurrentUser():
    Observable<CurrentUserResponse> {

    return this.http
      .get<CurrentUserResponse>(
        `${this.apiUrl}/me`
      )
      .pipe(
        tap(response => {

          this.currentUserSignal.set(
            response.user
          );

        })
      );

  }

  getToken(): string | null {

    return localStorage.getItem(
      'accessToken'
    );

  }

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

  isAuthenticated(): boolean {

    return this.isLoggedIn();

  }

  logout(): void {

    localStorage.removeItem(
      'accessToken'
    );

    localStorage.removeItem(
      'refreshToken'
    );

    this.currentUserSignal.set(null);

  }

}
