import {
  Injectable,
  inject,
  signal,
  computed,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  Observable,
  tap,
} from 'rxjs';

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

  private apiUrl =
    'http://localhost:3000/api/auth';

  private currentUserSignal =
    signal<User | null>(null);

  private initializedSignal =
    signal(false);

  readonly currentUser =
    computed(() =>
      this.currentUserSignal(),
    );

  readonly isAuthenticated =
    computed(() =>
      !!this.currentUserSignal(),
    );

  readonly isAdmin =
    computed(() =>
      this.currentUserSignal()?.role ===
      'Admin',
    );

  readonly isInitialized =
    computed(() =>
      this.initializedSignal(),
    );

  login(
    payload: LoginRequest,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        payload,
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(
            'accessToken',
            response.token,
          );

          this.currentUserSignal.set(
            response.user,
          );
        }),
      );
  }

  register(
    payload: RegisterRequest,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/register`,
        payload,
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(
            'accessToken',
            response.token,
          );

          this.currentUserSignal.set(
            response.user,
          );
        }),
      );
  }

  loadCurrentUser():
    Observable<CurrentUserResponse> {
    return this.http
      .get<CurrentUserResponse>(
        `${this.apiUrl}/me`,
      )
      .pipe(
        tap({
          next: (response) => {
            this.currentUserSignal.set(
              response.user,
            );

            this.initializedSignal.set(
              true,
            );
          },
          error: () => {
            this.currentUserSignal.set(
              null,
            );

            this.initializedSignal.set(
              true,
            );
          },
        }),
      );
  }

  getToken(): string | null {
    return localStorage.getItem(
      'accessToken',
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user =
      this.currentUserSignal();

    return user?.role === role;
  }

  hasAnyRole(
    roles: string[],
  ): boolean {
    const user =
      this.currentUserSignal();

    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }

  hasPermission(
    permission: string,
  ): boolean {
    const user =
      this.currentUserSignal();

    if (!user) {
      return false;
    }

    return user.permissions.includes(
      permission,
    );
  }

  hasAllPermissions(
    permissions: string[],
  ): boolean {
    const user =
      this.currentUserSignal();

    if (!user) {
      return false;
    }

    return permissions.every((p) =>
      user.permissions.includes(p),
    );
  }

  logout(): void {
    localStorage.removeItem(
      'accessToken',
    );

    this.currentUserSignal.set(
      null,
    );
  }
}
