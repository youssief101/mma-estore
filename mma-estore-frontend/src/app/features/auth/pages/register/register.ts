import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

import { Card } from '../../../../shared/components/card/card';
import { Input } from '../../../../shared/components/input/input';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Card, Input, PasswordInput, Button],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  loading = false;
  redirecting = false;
  successMessage = '';
  errorMessage = '';

  registerForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-z0-9_]+$/),
      ],
    ],

    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],

    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],

    email: ['', [Validators.required, Validators.email]],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/),
      ],
    ],

    phone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.authService
      .register({
        username: this.registerForm.value.username!,

        firstName: this.registerForm.value.firstName!,

        lastName: this.registerForm.value.lastName!,

        email: this.registerForm.value.email!,

        password: this.registerForm.value.password!,

        phone: this.registerForm.value.phone || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;

          this.redirecting = true;

          this.successMessage = 'Account created successfully. Redirecting to login...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;

          this.errorMessage = err.error?.message ?? 'Registration failed.';
        },
      });
  }
  get passwordStrength(): number {
    const password = this.registerForm.controls.password.value ?? '';

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/\d/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    return score;
  }

  get passwordStrengthLabel(): string {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        return 'Weak';

      case 2:
      case 3:
        return 'Medium';

      case 4:
        return 'Strong';

      case 5:
        return 'Very Strong';

      default:
        return '';
    }
  }
}

