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
  successMessage = '';

  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]],
  });

  onSubmit(): void {
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
      })
      .subscribe({
        next: () => {
          this.loading = false;

          this.successMessage = 'Login successful.';

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        },

        error: (err) => {
          this.loading = false;

          this.errorMessage = err.error?.message ?? 'Login failed.';
        },
      });
  }
}
