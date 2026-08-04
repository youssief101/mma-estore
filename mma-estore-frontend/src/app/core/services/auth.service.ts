import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CurrentUserResponse
} from '../models/auth.models';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:5001/api/auth';

  private _currentUser = signal<User | null>(null);

  currentUser = this._currentUser.asReadonly();

  login(payload: LoginRequest): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        payload
      )
      .pipe(
        tap((response) => {

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

          if (response.user) {

            this._currentUser.set(
              response.user
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

  logout(): void {

    localStorage.removeItem(
      'accessToken'
    );

    localStorage.removeItem(
      'refreshToken'
    );

    this._currentUser.set(
      null
    );

  }

  isAuthenticated(): boolean {

    return !!localStorage.getItem(
      'accessToken'
    );

  }

  isLoggedIn(): boolean {

    return this.isAuthenticated();

  }

  getToken(): string | null {

    return localStorage.getItem(
      'accessToken'
    );

  }

  loadCurrentUser(): Observable<CurrentUserResponse> {

    return this.http
      .get<CurrentUserResponse>(
        `${this.apiUrl}/me`
      )
      .pipe(
        tap((response) => {

          this._currentUser.set(
            response.user
          );

        })
      );

  }

}
