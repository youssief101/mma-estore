import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs'; 

import { ProductService } from '../../../../../services/product.service';
import { CategoryService } from '../../../../../services/category.service';
import { FighterService } from '../../../../../services/fighter.service';
import { BrandService } from '../../../../../services/brand.service';
// ADD THESE TWO IMPORTS:
import { DepartmentService } from '../../../../../services/department.service';
import { EventService } from '../../../../../services/event.service';

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
  imports: [CommonModule, ProductsSidebar],
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
  // INJECT THE NEW SERVICES:
  private readonly departmentService = inject(DepartmentService);
  private readonly eventService = inject(EventService);
  
  private readonly cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  totalProducts = 0;
  activeTags: ActiveTag[] = [];
  
  private filterLookup: { [id: string]: string } = {};

  ngOnInit(): void {
    this.loadFilterMetadata();
    
    this.route.queryParams.subscribe(params => {
      this.loadFilteredProducts(params);
      this.calculateActiveTags(params);
    });
  }

  private loadFilterMetadata(): void {
    // UPDATED forkJoin to include all 5 filter types
    forkJoin({
      categories: this.categoryService.getAllCategories(),
      fighters: this.fighterService.getAllFighters(),
      brands: this.brandService.getAllBrands(),
      departments: this.departmentService.getAllDepartments(),
      events: this.eventService.getAllEvents()
    }).subscribe(res => {
      // Map Categories
      res.categories.categories.forEach(c => this.filterLookup[c._id] = c.name);
      
      // Map Fighters
      res.fighters.fighters.forEach(f => this.filterLookup[f._id] = `${f.firstName} ${f.lastName}`);
      
      // Map Brands
      res.brands.brands.forEach(b => this.filterLookup[b._id] = b.name);
      
      // NEW: Map Departments
      res.departments.departments.forEach(d => this.filterLookup[d._id] = d.name);
      
      // NEW: Map Events
      res.events.events.forEach(e => this.filterLookup[e._id] = e.name);
      
      // Recalculate tags now that we have all the names
      this.calculateActiveTags(this.route.snapshot.queryParams);
    });
  }

  private calculateActiveTags(params: any): void {
    this.activeTags = [];
    Object.keys(params).forEach(key => {
      const val = params[key];
      if (val) {
        const ids = val.split(',');
        ids.forEach((id: string) => {
          // If the ID is found in our lookup table, use the name, otherwise show '...'
          this.activeTags.push({
            id,
            name: this.filterLookup[id] || '...', 
            key
          });
        });
      }
    });
    this.cdr.detectChanges();
  }

  // ... rest of your methods (removeTag, loadFilteredProducts, etc.) remain the same
  
  removeTag(tag: ActiveTag): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    const val = currentParams[tag.key];
    if (!val) return;

    const ids = val.split(',');
    const newIds = ids.filter((id: string) => id !== tag.id);
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [tag.key]: newIds.length ? newIds.join(',') : null },
      queryParamsHandling: 'merge' 
    });
  }

  loadFilteredProducts(filters: any): void {
    this.loading = true;
    this.productService.filterProducts(filters).subscribe({
      next: (res) => {
        this.products = res.products || [];
        this.totalProducts = this.products.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getProductImage(product: Product): string {
    if (!product.images?.length) return '/images/placeholder.png';
    const primary = product.images.find(img => img.isPrimary);
    const url = primary ? primary.url : product.images[0].url;
    return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
  }

  clearFilters() {
    this.router.navigate(['/products'], { queryParams: {} });
  }
}