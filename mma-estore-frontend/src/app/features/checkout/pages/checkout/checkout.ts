import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);

  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', Validators.required],

    address: ['', Validators.required],

    city: ['', Validators.required],

    country: ['', Validators.required],

    postalCode: ['', Validators.required],

    paymentMethod: ['card', Validators.required],
  });

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();

      return;
    }

    console.log(this.checkoutForm.value);
  }
}
