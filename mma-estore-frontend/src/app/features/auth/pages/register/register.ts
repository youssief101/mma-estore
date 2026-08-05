import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterModal {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  loading = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
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
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        username: this.registerForm.value.email!.split('@')[0],
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess = true;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message ?? 'Something went wrong.';
        },
      });
  }

  onClose(): void {
    this.registerForm.reset();
    this.showSuccess = false;
    this.errorMessage = '';
    this.closeModal.emit();
  }

  goToLogin(): void {
    this.onClose();
    this.router.navigate(['/login']);
  }
}
