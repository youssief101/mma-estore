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
import { Category } from '../../../../../models/category.model';
import { Fighter } from '../../../../../models/fighter.model';
import { Brand } from '../../../../../models/brand.model';

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
  categories: Category[] = [];
  fighters: Fighter[] = [];
  brands: Brand[] = [];
  orders: Order[] = [];

  loading = true;
  searchTerm = '';

  // MODAL STATES
  showProductModal = false;
  editingProduct: Partial<Product> | null = null;

  showCategoryModal = false;
  editingCategory: Partial<Category> | null = null;

  showFighterModal = false;
  editingFighter: Partial<Fighter> | null = null;

  showBrandModal = false;
  editingBrand: Partial<Brand> | null = null;

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

    this.reloadCategories();
    this.reloadFighters();
    this.reloadBrands();
    this.orderService.getAllOrdersAdmin().subscribe(res => this.orders = res || []);
  }

  reloadCategories(): void {
    this.categoryService.getAllCategories().subscribe(res => {
      this.categories = res.categories || [];
      this.cdr.detectChanges();
    });
  }

  reloadFighters(): void {
    this.fighterService.getAllFighters().subscribe(res => {
      this.fighters = res.fighters || [];
      this.cdr.detectChanges();
    });
  }

  reloadBrands(): void {
    this.brandService.getAllBrands().subscribe(res => {
      this.brands = res.brands || [];
      this.cdr.detectChanges();
    });
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
      inventory: { totalStock: 50, stockQuantity: 50, isAvailable: true, inStock: true } as any,
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
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(this.editingProduct).subscribe({
        next: () => {
          this.toastService.success('Product created successfully!');
          this.showProductModal = false;
          this.loadAllAdminData();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to create product');
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

  // CATEGORY ACTIONS
  openAddCategoryModal(): void {
    this.editingCategory = {
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500'
    };
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: Category): void {
    this.editingCategory = { ...category };
    this.showCategoryModal = true;
  }

  saveCategory(): void {
    if (!this.editingCategory || !this.editingCategory.name) return;

    if (this.editingCategory._id) {
      this.categoryService.updateCategory(this.editingCategory._id, this.editingCategory).subscribe({
        next: () => {
          this.toastService.success('Category updated successfully!');
          this.showCategoryModal = false;
          this.reloadCategories();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to update category.');
        }
      });
    } else {
      this.categoryService.createCategory(this.editingCategory).subscribe({
        next: () => {
          this.toastService.success('Category created successfully!');
          this.showCategoryModal = false;
          this.reloadCategories();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to create category.');
        }
      });
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toastService.success('Category deleted.');
          this.reloadCategories();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to delete category.');
        }
      });
    }
  }

  // FIGHTER ACTIONS
  openAddFighterModal(): void {
    this.editingFighter = {
      firstName: '',
      lastName: '',
      nickname: '',
      gender: 'Male',
      weightClass: 'Lightweight',
      ranking: 1,
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
      champion: false
    };
    this.showFighterModal = true;
  }

  openEditFighterModal(fighter: Fighter): void {
    this.editingFighter = { ...fighter };
    this.showFighterModal = true;
  }

  saveFighter(): void {
    if (!this.editingFighter || !this.editingFighter.firstName || !this.editingFighter.lastName) return;

    if (this.editingFighter._id) {
      this.fighterService.updateFighter(this.editingFighter._id, this.editingFighter).subscribe({
        next: () => {
          this.toastService.success('Fighter updated successfully!');
          this.showFighterModal = false;
          this.reloadFighters();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to update fighter.');
        }
      });
    } else {
      this.fighterService.createFighter(this.editingFighter).subscribe({
        next: () => {
          this.toastService.success('Fighter created successfully!');
          this.showFighterModal = false;
          this.reloadFighters();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to create fighter.');
        }
      });
    }
  }

  deleteFighter(id: string): void {
    if (confirm('Are you sure you want to delete this fighter?')) {
      this.fighterService.deleteFighter(id).subscribe({
        next: () => {
          this.toastService.success('Fighter deleted.');
          this.reloadFighters();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to delete fighter.');
        }
      });
    }
  }

  // BRAND ACTIONS
  openAddBrandModal(): void {
    this.editingBrand = {
      name: '',
      description: '',
      logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
      website: ''
    };
    this.showBrandModal = true;
  }

  openEditBrandModal(brand: Brand): void {
    this.editingBrand = { ...brand };
    this.showBrandModal = true;
  }

  saveBrand(): void {
    if (!this.editingBrand || !this.editingBrand.name) return;

    if (this.editingBrand._id) {
      this.brandService.updateBrand(this.editingBrand._id, this.editingBrand).subscribe({
        next: () => {
          this.toastService.success('Brand updated successfully!');
          this.showBrandModal = false;
          this.reloadBrands();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to update brand.');
        }
      });
    } else {
      this.brandService.createBrand(this.editingBrand).subscribe({
        next: () => {
          this.toastService.success('Brand created successfully!');
          this.showBrandModal = false;
          this.reloadBrands();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to create brand.');
        }
      });
    }
  }

  deleteBrand(id: string): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe({
        next: () => {
          this.toastService.success('Brand deleted.');
          this.reloadBrands();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to delete brand.');
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
