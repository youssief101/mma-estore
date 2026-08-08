import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AddressesResponse,
  AddressResponse,
  Address,
} from '../models/profile.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${this.apiUrl}/profile`,
    );
  }

  updateProfile(
    payload: UpdateProfileRequest,
  ): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(
      `${this.apiUrl}/profile`,
      payload,
    );
  }

  changePassword(
    payload: ChangePasswordRequest,
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/change-password`,
      payload,
    );
  }

  getAddresses(): Observable<AddressesResponse> {
    return this.http.get<AddressesResponse>(
      `${this.apiUrl}/addresses`,
    );
  }

  addAddress(
    payload: Partial<Address>,
  ): Observable<AddressResponse> {
    return this.http.post<AddressResponse>(
      `${this.apiUrl}/addresses`,
      payload,
    );
  }

  updateAddress(
    addressId: string,
    payload: Partial<Address>,
  ): Observable<AddressResponse> {
    return this.http.put<AddressResponse>(
      `${this.apiUrl}/addresses/${addressId}`,
      payload,
    );
  }

  deleteAddress(
    addressId: string,
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/addresses/${addressId}`,
    );
  }
}
