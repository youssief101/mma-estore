import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../../../services/product.service';
import { Product } from '../../../../../models/product.model';

import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ProductCard
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  private route = inject(ActivatedRoute);

  private productService = inject(ProductService);

  private cartService = inject(CartService);

  product: Product | null = null;

  relatedProducts: Product[] = [];

  loading = true;

  selectedSize = '';

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.productService.getProduct(id).subscribe({

      next: (response) => {

        console.log('PRODUCT:', response.product);

        this.product = response.product;

        if (
          this.product?.inventory?.variants?.length
        ) {
          this.selectedSize =
            this.product.inventory.variants[0].size;
        }

        this.loadRelatedProducts(id);

        this.loading = false;
      },

      error: (error) => {

        console.error(error);

        this.loading = false;
      }
    });
  }

  loadRelatedProducts(id: string): void {

    this.productService.getRelatedProducts(id).subscribe({

      next: (response) => {
        this.relatedProducts = response.products;
      },

      error: (error) => {
        console.error(error);
      }
    });
  }

  onAddToCart(product: Product): void {

    this.cartService.addToCart(product);

    alert(`${product.name} added to cart`);
  }

  addToCart(): void {

    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.selectedSize || undefined
    );

    alert(`${this.product.name} added to cart`);
  }
  getImageUrl(url?: string): string {
  return url
    ? `http://localhost:3000${url}`
    : 'assets/images/no-image.png';
}

}
