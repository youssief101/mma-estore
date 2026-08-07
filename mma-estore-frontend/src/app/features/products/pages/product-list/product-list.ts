import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ProductService } from '../../../../../services/product.service';
import { CategoryService } from '../../../../../services/category.service';
import { FighterService } from '../../../../../services/fighter.service';
import { BrandService } from '../../../../../services/brand.service';
import { DepartmentService } from '../../../../../services/department.service';
import { EventService } from '../../../../../services/event.service';
import { CartService } from '../../../../core/services/cart.service';

import { Product } from '../../../../../models/product.model';
import { ProductsSidebar } from '../products-sidebar/products-sidebar';

interface ActiveTag {
  id: string;
  name: string;
  key: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductsSidebar, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly fighterService = inject(FighterService);
  private readonly brandService = inject(BrandService);
  private readonly departmentService = inject(DepartmentService);
  private readonly eventService = inject(EventService);
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  totalProducts = 0;
  totalPages = 1;
  currentPage = 1;
  itemsPerPage = 24;
  sortOption = 'newest';
  viewMode: 'grid' | 'list' = 'grid';
  mobileFiltersOpen = false;

  activeTags: ActiveTag[] = [];
  private filterLookup: { [id: string]: string } = {};

  ngOnInit(): void {
    this.loadFilterMetadata();

    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page'] || '1', 10);
      this.itemsPerPage = parseInt(params['limit'] || '24', 10);
      this.sortOption = params['sort'] || 'newest';

      this.loadFilteredProducts(params);
      this.calculateActiveTags(params);
    });
  }

  private loadFilterMetadata(): void {
    forkJoin({
      categories: this.categoryService.getAllCategories(),
      fighters: this.fighterService.getAllFighters(),
      brands: this.brandService.getAllBrands(),
      departments: this.departmentService.getAllDepartments(),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: (res) => {
        if (res.categories?.categories) {
          res.categories.categories.forEach(c => this.filterLookup[c._id] = c.name);
        }
        if (res.fighters?.fighters) {
          res.fighters.fighters.forEach(f => this.filterLookup[f._id] = `${f.firstName} ${f.lastName}`);
        }
        if (res.brands?.brands) {
          res.brands.brands.forEach(b => this.filterLookup[b._id] = b.name);
        }
        if (res.departments?.departments) {
          res.departments.departments.forEach(d => this.filterLookup[d._id] = d.name);
        }
        if (res.events?.events) {
          res.events.events.forEach(e => this.filterLookup[e._id] = e.name);
        }
        this.calculateActiveTags(this.route.snapshot.queryParams);
      },
      error: () => {}
    });
  }

  private calculateActiveTags(params: any): void {
    this.activeTags = [];
    const ignoredKeys = ['page', 'limit', 'sort', 'view'];

    Object.keys(params).forEach(key => {
      if (ignoredKeys.includes(key)) return;
      const val = params[key];
      if (val) {
        const ids = val.split(',');
        ids.forEach((id: string) => {
          this.activeTags.push({
            id,
            name: this.filterLookup[id] || id,
            key
          });
        });
      }
    });
    this.cdr.detectChanges();
  }

  removeTag(tag: ActiveTag): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    const val = currentParams[tag.key];
    if (!val) return;

    const ids = val.split(',');
    const newIds = ids.filter((id: string) => id !== tag.id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [tag.key]: newIds.length ? newIds.join(',') : null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  loadFilteredProducts(filters: any): void {
    this.loading = true;
    this.productService.filterProducts(filters).subscribe({
      next: (res) => {
        let loaded = res.products || [];

        // Apply client-side sorting if needed
        if (this.sortOption === 'priceAsc') {
          loaded = [...loaded].sort((a, b) => a.price - b.price);
        } else if (this.sortOption === 'priceDesc') {
          loaded = [...loaded].sort((a, b) => b.price - a.price);
        } else if (this.sortOption === 'name') {
          loaded = [...loaded].sort((a, b) => a.name.localeCompare(b.name));
        }

        this.products = loaded;
        this.totalProducts = res.totalProducts || loaded.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.itemsPerPage));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.products = [];
        this.totalProducts = 0;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSortChange(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  onLimitChange(event: Event): void {
    const limit = parseInt((event.target as HTMLSelectElement).value, 10);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { limit, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen = !this.mobileFiltersOpen;
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
  }

  getProductImage(product: Product): string {
    if (!product.images?.length) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop';
    const primary = product.images.find(img => img.isPrimary);
    const url = primary ? primary.url : product.images[0].url;
    if (!url) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop';
    return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
  }

  clearFilters(): void {
    this.router.navigate(['/products'], { queryParams: {} });
  }

  get startItemIndex(): number {
    if (this.totalProducts === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItemIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalProducts);
  }
}
