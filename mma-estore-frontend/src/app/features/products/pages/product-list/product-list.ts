import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../../../services/product.service';

import { Product } from '../../../../../models/product.model';

import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);

  products: any[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts(1, 12).subscribe({
      next: (response) => {
        this.products = response.products.map((product: any) => ({
          ...product,

          image:
            product.images?.find((img: any) => img.isPrimary)?.url ||
            product.images?.[0]?.url ||
            '/products/placeholder.jpg',

          brand: product.brandID?.name || 'Unknown Brand',

          category: product.categoryID?.name || 'Uncategorized',
        }));

        this.loading = false;

        console.log(response);
      },

      error: (error) => {
        console.error(error);

        this.loading = false;
      },
    });
  }

  onAddToCart(product: any): void {
    console.log('Add to cart:', product);
  }
}
