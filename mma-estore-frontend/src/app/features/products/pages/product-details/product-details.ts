import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../../../services/product.service';

import { Product } from '../../../../../models/product.model';

import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-details',

  standalone: true,

  imports: [CommonModule, ProductCard],

  templateUrl: './product-details.html',

  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);

  private productService = inject(ProductService);

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
        this.product = response.product;

        if (this.product.inventory?.variants?.length) {
          this.selectedSize = this.product.inventory.variants[0].size;
        }

        this.loadRelatedProducts(id);

        this.loading = false;
      },

      error: (error) => {
        console.error(error);

        this.loading = false;
      },
    });
  }

  loadRelatedProducts(id: string): void {
    this.productService.getRelatedProducts(id).subscribe({
      next: (response) => {
        this.relatedProducts = response.products;
      },

      error: (error) => {
        console.error('Related products error:', error);
      },
    });
  }

  onAddToCart(product: Product): void {
    console.log('Add related product:', product);
  }
}
