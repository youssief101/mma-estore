import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  tap,
  catchError,
  of
} from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse
} from '../models/auth.models';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'mma_token';

  private readonly currentUserSignal =
    signal<User | null>(null);

  readonly currentUser =
    this.currentUserSignal.asReadonly();

  readonly isAuthenticated =
    computed(() => this.currentUser() !== null);

  constructor(
    private http: HttpClient
  ) {}

  register(data: RegisterRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data
    ).pipe(
      tap(response => {

        this.saveToken(response.token);

        this.currentUserSignal.set(response.user);

      })
    );

  }

  login(data: LoginRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => {

        this.saveToken(response.token);

        this.currentUserSignal.set(response.user);

      })
    );

  }

  getCurrentUser(): Observable<{
    success: boolean;
    user: User;
  }> {

    return this.http.get<{
      success: boolean;
      user: User;
    }>(
      `${this.apiUrl}/me`
    ).pipe(
      tap(response => {

        this.currentUserSignal.set(
          response.user
        );

      })
    );

  }

  loadCurrentUser(): Observable<unknown> {

    if (!this.hasToken()) {

      return of(null);

    }

    return this.getCurrentUser().pipe(

      catchError(() => {

        this.logout();

        return of(null);

      })

    );

  }

  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);

    this.currentUserSignal.set(null);

  }

  saveToken(token: string): void {

    localStorage.setItem(
      this.TOKEN_KEY,
      token
    );

  }

  getToken(): string | null {

    return localStorage.getItem(
      this.TOKEN_KEY
    );

  }

  isLoggedIn(): boolean {

    return !!this.getToken();

  }

  hasToken(): boolean {

    return !!this.getToken();

  }

}