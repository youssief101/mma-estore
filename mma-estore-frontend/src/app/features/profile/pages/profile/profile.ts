import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Address } from '../../../../core/models/profile.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = true;
  saving = false;
  passwordSaving = false;
  successMessage = '';
  errorMessage = '';

  activeTab: 'personal' | 'addresses' | 'security' = 'personal';

  userMeta: any = null;
  addresses: Address[] = [];
  showAddressModal = false;
  showLogoutModal = false;
  editingAddressId: string | null = null;

  profileForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  addressForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    country: ['United States', Validators.required],
    governorate: [''],
    city: ['', Validators.required],
    street: ['', Validators.required],
    building: [''],
    apartment: [''],
    postalCode: ['', Validators.required],
    isDefault: [false]
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.userMeta = currentUser;
      this.profileForm.patchValue({
        username: currentUser.username ?? '',
        firstName: currentUser.firstName ?? '',
        lastName: currentUser.lastName ?? '',
        email: currentUser.email ?? '',
        phone: currentUser.phone ?? '',
      });
      this.loading = false;
    }

    this.loadProfile();
    this.loadAddresses();
  }

  loadProfile(): void {
    if (!this.userMeta) {
      this.loading = true;
    }
    this.errorMessage = '';
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response && response.user) {
          this.userMeta = response.user;
          this.authService.updateCurrentUser(response.user);
          this.profileForm.patchValue({
            username: response.user.username ?? '',
            firstName: response.user.firstName ?? '',
            lastName: response.user.lastName ?? '',
            email: response.user.email ?? '',
            phone: response.user.phone ?? '',
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('PROFILE ERROR', error);
        this.loading = false;
        if (error?.status === 401) {
          this.authService.clearSession();
          this.router.navigate(['/login']);
        } else if (!this.userMeta) {
          this.errorMessage = error?.error?.message || 'Unable to load profile data. Please try logging in again.';
        }
      },
    });
  }

  loadAddresses(): void {
    this.userService.getAddresses().subscribe({
      next: (res) => {
        this.addresses = res.addresses || [];
      },
      error: () => {}
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: (res) => {
        this.saving = false;
        this.successMessage = 'Profile information updated successfully!';
        if (res.user) {
          this.userMeta = { ...this.userMeta, ...res.user };
          this.authService.updateCurrentUser(res.user as any);
        }
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Failed to update profile.';
        setTimeout(() => this.errorMessage = '', 4000);
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => {
        this.passwordSaving = false;
        this.passwordForm.reset();
        this.successMessage = 'Password changed successfully.';
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.passwordSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to change password. Check your current password.';
        setTimeout(() => this.errorMessage = '', 4000);
      },
    });
  }

  openAddAddressModal(): void {
    this.editingAddressId = null;
    this.addressForm.reset({
      fullName: `${this.profileForm.value.firstName} ${this.profileForm.value.lastName}`.trim(),
      phone: this.profileForm.value.phone || '',
      country: 'United States',
      governorate: '',
      city: '',
      street: '',
      building: '',
      apartment: '',
      postalCode: '',
      isDefault: this.addresses.length === 0
    });
    this.showAddressModal = true;
  }

  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const payload = this.addressForm.getRawValue();
    if (this.editingAddressId) {
      this.userService.updateAddress(this.editingAddressId, payload).subscribe({
        next: () => {
          this.showAddressModal = false;
          this.loadAddresses();
          this.successMessage = 'Address updated.';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {}
      });
    } else {
      this.userService.addAddress(payload).subscribe({
        next: () => {
          this.showAddressModal = false;
          this.loadAddresses();
          this.successMessage = 'Address added successfully.';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {}
      });
    }
  }

  deleteAddress(id: string): void {
    if (confirm('Are you sure you want to remove this address?')) {
      this.userService.deleteAddress(id).subscribe({
        next: () => this.loadAddresses(),
        error: () => {}
      });
    }
  }

  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  executeLogout(): void {
    try {
      this.showLogoutModal = false;
      this.authService.logout();
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Logout error:', err);
      this.authService.clearSession();
      this.router.navigate(['/']);
    }
  }

  getUserInitials(): string {
    const fn = this.profileForm.value.firstName || '';
    const ln = this.profileForm.value.lastName || '';
    return ((fn[0] || '') + (ln[0] || '')).toUpperCase() || 'UFC';
  }
}
