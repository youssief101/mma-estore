import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../../../../services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImageIndex = 0;
  selectedSize = 'M';
  quantity = 1;
  loading = true;
  notFound = false;

  availableSizes = ['S', 'M', 'L', 'XL', '2XL'];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.notFound = false;
    this.selectedImageIndex = 0;
    this.quantity = 1;

    this.productService.getProduct(id).subscribe({
      next: (res) => {
        if (res && res.product) {
          this.product = res.product;
          this.loading = false;
          this.loadRelatedProducts(this.product._id);
        } else {
          this.notFound = true;
          this.loading = false;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedProducts(id: string): void {
    this.productService.getRelatedProducts(id).subscribe({
      next: (res) => {
        this.relatedProducts = res.products || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.relatedProducts = [];
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  updateQuantity(delta: number): void {
    const next = this.quantity + delta;
    if (next >= 1 && next <= 99) {
      this.quantity = next;
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
  }

  getImageUrl(images: any[], index = 0): string {
    if (!images || images.length === 0) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop';
    }
    const target = images[index] || images[0];
    const url = typeof target === 'string' ? target : target.url;
    if (!url) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop';
    return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
  }
}
