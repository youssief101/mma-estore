import { User } from './user.model';

export interface Address {
  _id: string;

  fullName: string;

  phone: string;

  country: string;

  governorate: string;

  city: string;

  street: string;

  building?: string;

  apartment?: string;

  postalCode?: string;

  isDefault: boolean;
}

export interface ProfileResponse {
  success: boolean;

  user: User;
}

export interface UpdateProfileRequest {
  username?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;

  newPassword: string;
}

export interface AddressesResponse {
  success: boolean;

  count: number;

  addresses: Address[];
}

export interface AddressResponse {
  success: boolean;

  message: string;

  address: Address;
}
