import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../services/product.service';
import { Product } from '../../../../../models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products: Product[] = [];
  loading = true;
  searchTerm = '';
  selectedAudience = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(1, 12).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

 searchProducts(): void {
  if (!this.searchTerm.trim()) {
    this.loadProducts();
    return;
  }

  this.loading = true;
  console.log('🔍 Searching for:', this.searchTerm);

  this.productService.searchProducts(this.searchTerm.trim()).subscribe({
    next: (response) => {
      console.log('🔍 Search results:', response);
      this.products = response.products || [];
      this.loading = false;
    },
    error: (error) => {
      console.error('❌ Search error:', error);
      this.loading = false;
    },
  });
}

  filterProducts(): void {
    const filters: any = {};
    if (this.selectedAudience) {
      filters.audience = this.selectedAudience;
    }
    this.loading = true;
    this.productService.filterProducts(filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedAudience = '';
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart`);
  }
}
