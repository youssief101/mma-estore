import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  total = 0;

  checkoutForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: ['', Validators.required],
    paymentMethod: ['Cash', Validators.required],
  });

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.cartItems = items;
      this.subtotal = this.cartService.getTotal();
      this.shipping = 0;
      this.total = this.subtotal + this.shipping;
    });
  }

  getImageUrl(url?: string): string {
    if (!url) return 'assets/images/no-image.png';
    if (url.startsWith('http')) return url;
    const parts = url.split('/');
    let filename = parts[parts.length - 1];
    if (filename.toLowerCase().endsWith('.png')) {
      filename = filename.slice(0, -4) + '.jpg';
    }
    return `/products/${filename}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image.png';
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.cartItems.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Your cart is empty', timer: 2000, showConfirmButton: false });
      return;
    }

    const form = this.checkoutForm.getRawValue();

    const order = {
      shippingAddress: {
        firstName: form.firstName!,
        lastName: form.lastName!,
        phone: form.phone!,
        country: form.country!,
        city: form.city!,
        street: form.address!,
        building: '',
        apartment: '',
        postalCode: form.postalCode!,
      },
      paymentMethod: form.paymentMethod!,
      items: this.cartItems.map((item) => ({
        productID: item.product._id,
        productName: item.product.name,
        imageUrl: item.product.images?.[0]?.url || '',
        size: item.selectedSize || 'M',
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        Swal.fire({ icon: 'success', title: 'Order Placed!', text: 'Thank you for your purchase.', timer: 3000, showConfirmButton: false });
        this.cartService.clearCart();
        this.router.navigate(['/order-success']);
      },
      error: (error) => {
        console.error(error);
        const msg = error.error?.message || error.error?.errors?.[0]?.message || 'Failed to place order.';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      },
    });
  }
}
