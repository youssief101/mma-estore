import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Card } from '../../../../shared/components/card/card';
import { Input } from '../../../../shared/components/input/input';
import { PasswordInput } from '../../../../shared/components/password-input/password-input';
import { Button } from '../../../../shared/components/button/button';

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    Card,
    Input,
    PasswordInput,
    Button,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  redirecting = false;
  successMessage = '';
  errorMessage = '';

  registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator }
  );

  constructor() {
    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const val = this.registerForm.getRawValue();

    this.authService
      .register({
        firstName: val.firstName!,
        lastName: val.lastName!,
        username: val.username!,
        email: val.email!,
        password: val.password!,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.redirecting = true;
          this.successMessage = 'Account created successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message ?? 'Registration failed. Please try again.';
        },
      });
  }
}
