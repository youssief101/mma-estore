import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CurrentUserResponse
} from '../models/auth.models';

import { API } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  register(data: RegisterRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      API.BASE_URL + API.AUTH.REGISTER,
      data
    );

  }

  login(data: LoginRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      API.BASE_URL + API.AUTH.LOGIN,
      data
    );

  }

  getCurrentUser(): Observable<CurrentUserResponse> {

    return this.http.get<CurrentUserResponse>(
      API.BASE_URL + API.AUTH.ME
    );

  }

}