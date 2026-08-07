import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../../../services/product.service';
import { CategoryService } from '../../../../../services/category.service';
import { FighterService } from '../../../../../services/fighter.service';
import { BrandService } from '../../../../../services/brand.service';
import { OrderService, Order } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../../models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly fighterService = inject(FighterService);
  private readonly brandService = inject(BrandService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  activeTab: 'products' | 'categories' | 'fighters' | 'brands' | 'orders' = 'products';

  // DATA
  products: Product[] = [];
  categories: any[] = [];
  fighters: any[] = [];
  brands: any[] = [];
  orders: Order[] = [];

  loading = true;
  searchTerm = '';

  // MODAL STATES
  showProductModal = false;
  editingProduct: Partial<Product> | null = null;

  showCategoryModal = false;
  editingCategory: any = null;

  showFighterModal = false;
  editingFighter: any = null;

  ngOnInit(): void {
    this.loadAllAdminData();
  }

  loadAllAdminData(): void {
    this.loading = true;
    this.productService.filterProducts({ limit: 100 }).subscribe({
      next: (res) => {
        this.products = res.products || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.categoryService.getAllCategories().subscribe(res => this.categories = res.categories || []);
    this.fighterService.getAllFighters().subscribe(res => this.fighters = res.fighters || []);
    this.brandService.getAllBrands().subscribe(res => this.brands = res.brands || []);
    this.orderService.getAllOrdersAdmin().subscribe(res => this.orders = res || []);
  }

  switchTab(tab: 'products' | 'categories' | 'fighters' | 'brands' | 'orders'): void {
    this.activeTab = tab;
  }

  // PRODUCT ACTIONS
  openAddProductModal(): void {
    this.editingProduct = {
      name: '',
      price: 0,
      description: '',
      inventory: { stockQuantity: 50, isAvailable: true, inStock: true } as any,
      images: [{ url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500', isPrimary: true }]
    };
    this.showProductModal = true;
  }

  openEditProductModal(product: Product): void {
    this.editingProduct = { ...product };
    this.showProductModal = true;
  }

  saveProduct(): void {
    if (!this.editingProduct || !this.editingProduct.name) return;

    if (this.editingProduct._id) {
      this.productService.updateProduct(this.editingProduct._id, this.editingProduct).subscribe({
        next: () => {
          this.toastService.success('Product updated successfully!');
          this.showProductModal = false;
          this.loadAllAdminData();
        },
        error: () => {
          this.toastService.error('Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(this.editingProduct).subscribe({
        next: () => {
          this.toastService.success('Product created successfully!');
          this.showProductModal = false;
          this.loadAllAdminData();
        },
        error: () => {
          this.toastService.error('Failed to create product');
        }
      });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastService.success('Product deleted.');
          this.products = this.products.filter(p => p._id !== id);
        },
        error: () => {
          this.toastService.error('Failed to delete product.');
        }
      });
    }
  }

  // ORDER STATUS UPDATE
  updateOrderStatus(order: Order, newStatus: string): void {
    this.orderService.updateOrderStatusAdmin(order._id, newStatus as any).subscribe(() => {
      order.status = newStatus as any;
      this.toastService.success(`Order #${order.orderNumber} status updated to ${newStatus}`);
    });
  }

  get totalRevenue(): number {
    return this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p => p.name.toLowerCase().includes(term));
  }
}
