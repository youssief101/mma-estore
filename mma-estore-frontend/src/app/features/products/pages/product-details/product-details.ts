import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../../../services/product.service';
import { Product } from '../../../../../models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../core/services/cart.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductCard, RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  selectedSize = '';
  selectedImage = 0;
  quantity = 1;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.errorMessage = 'No product ID found';
      this.cdr.detectChanges();
      return;
    }

    this.productService.getProduct(id).subscribe({
      next: (response) => {
        try {
          console.log('✅ API Response:', response);

          if (!response || !response.product) {
            this.errorMessage = 'Product not found';
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }

          this.product = response.product;
          console.log('✅ Product:', this.product.name);

          if (this.product.inventory && this.product.inventory.variants && this.product.inventory.variants.length > 0) {
            const available = this.product.inventory.variants.find((v: any) => v.stock > 0);
            this.selectedSize = available ? available.size : this.product.inventory.variants[0].size;
          }

          this.loading = false;
          console.log('✅ loading = false');
          this.cdr.detectChanges();

          this.loadRelatedProducts(id);
        } catch (err) {
          console.error('❌ Error in next:', err);
          this.errorMessage = 'Error displaying product';
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        this.errorMessage = 'Failed to load product';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRelatedProducts(id: string): void {
    this.productService.getRelatedProducts(id).subscribe({
      next: (response) => {
        this.relatedProducts = (response && response.products) ? response.products : [];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Related error:', error);
      }
    });
  }

  increaseQty(): void {
    this.quantity = this.quantity + 1;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1;
    }
  }

  addToCart(): void {
  if (!this.product) return;

  for (let i = 0; i < this.quantity; i++) {
    this.cartService.addToCart(this.product, this.selectedSize || undefined);
  }

  Swal.fire({
    icon: 'success',
    title: 'Added to Cart!',
    text: `${this.quantity} × ${this.product.name}`,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
}

 onAddToCart(product: Product): void {
  this.cartService.addToCart(product);

  Swal.fire({
    icon: 'success',
    title: 'Added to Cart!',
    text: product.name,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
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


    return '/products/' + filename;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image.png';
  }
}
