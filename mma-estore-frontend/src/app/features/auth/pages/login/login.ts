import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

import { Card } from '../../../../shared/components/card/card';
import { Input } from '../../../../shared/components/input/input';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';
import { Checkbox } from '../../../../shared/components/checkbox/checkbox';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    Card,
    Input,
    PasswordInput,
    Checkbox,
    Button,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  loading = false;

  redirecting = false;

  successMessage = '';

  errorMessage = '';

  failedAttempts = 0;

  accountLocked = false;

  lockoutSeconds = 0;

  securityMessage = '';

  suspiciousLogin = false;

  requireMfa = false;

  emailNotVerified = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]],

    rememberMe: [false],

    mfaCode: [''],
  });

  constructor() {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  onSubmit(): void {
    if (this.accountLocked) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.authService
      .login({
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
        rememberMe: !!this.loginForm.value.rememberMe,
      })
      .subscribe({
        next: () => {
          this.loading = false;

          this.redirecting = true;

          this.successMessage = 'Login successful. Redirecting...';

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1200);
        },

        error: (err) => {
          this.loading = false;

          const status = err.status;
          const msg = err.error?.message;

          if (status === 404) {
            this.errorMessage = msg || 'Email does not exist.';
            return;
          }

          if (status === 401) {
            this.handleFailedLogin();
            this.errorMessage = msg || 'Incorrect password.';
            return;
          }

          if (status === 403) {
            this.errorMessage = msg || 'Your account is disabled.';
            return;
          }

          if (status === 412) {
            this.emailNotVerified = true;
            this.errorMessage = msg || 'Email address not verified.';
            return;
          }

          if (status === 428) {
            this.requireMfa = true;
            this.errorMessage = msg || 'Two-factor authentication required.';
            return;
          }

          if (status === 0) {
            this.errorMessage = 'Unable to reach the server. Check your connection.';
            return;
          }

          this.errorMessage = msg ?? 'Something went wrong. Please try again.';
        },
      });
  }

  resendVerification(): void {
    this.successMessage = 'Verification email sent.';
  }

  onSocialLogin(provider: string): void {
    if (this.loading || this.redirecting || this.accountLocked) return;

    this.loading = true;
    this.errorMessage = '';

    const rememberMe = !!this.loginForm.value.rememberMe;

    this.authService.socialLogin(provider, rememberMe).subscribe({
      next: (res) => {
        this.loading = false;
        this.redirecting = true;
        this.successMessage = `${provider} login successful. Redirecting...`;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || `Failed to sign in with ${provider}.`;
      }
    });
  }

  private handleFailedLogin(): void {
    this.failedAttempts++;

    if (this.failedAttempts >= 3) {
      this.securityMessage = 'Multiple failed login attempts detected.';
    }

    if (this.failedAttempts >= 5) {
      this.startLockout();
    }
  }

  private startLockout(): void {
    this.accountLocked = true;

    this.lockoutSeconds = 30;

    this.securityMessage = 'Too many failed login attempts.';

    const timer = setInterval(() => {
      this.lockoutSeconds--;

      if (this.lockoutSeconds <= 0) {
        clearInterval(timer);

        this.accountLocked = false;

        this.failedAttempts = 0;

        this.securityMessage = '';
      }
    }, 1000);
  }
}
