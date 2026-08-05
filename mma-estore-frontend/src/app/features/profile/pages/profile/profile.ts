import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);

  private userService = inject(UserService);

  loading = false;

  saving = false;

  passwordSaving = false;

  profileForm = this.fb.nonNullable.group({
    username: ['', Validators.required],

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    email: ['', Validators.required],

    phone: [''],
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],

    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;

    this.userService.getProfile().subscribe({
      next: (response) => {
        console.log(response);

        this.profileForm.patchValue({
          username: response.user?.username ?? '',
          firstName: response.user?.firstName ?? '',
          lastName: response.user?.lastName ?? '',
          email: response.user?.email ?? '',
          phone: response.user?.phone ?? '',
        });

        this.loading = false;
      },

      error: (error) => {
        console.error(error);

        this.loading = false;
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();

      return;
    }

    this.saving = true;

    this.userService.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.saving = false;

        alert('Profile updated successfully.');
      },

      error: () => {
        this.saving = false;
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

      return;
    }

    this.passwordSaving = true;

    this.userService.changePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => {
        this.passwordSaving = false;

        this.passwordForm.reset();

        alert('Password changed successfully.');
      },

      error: () => {
        this.passwordSaving = false;
      },
    });
  }
}
