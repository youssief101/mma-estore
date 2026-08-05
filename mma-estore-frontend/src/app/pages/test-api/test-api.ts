import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { DepartmentService } from '../../../services/department.service';
import { FighterService } from '../../../services/fighter.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-api.html',
})
export class TestApiComponent {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private departmentService = inject(DepartmentService);
  private fighterService = inject(FighterService);
  private eventService = inject(EventService);

  response: unknown = null;

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log('Products', res);
        this.response = res;
      },
      error: console.error,
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        console.log('Categories', res);
        this.response = res;
      },
      error: console.error,
    });
  }

  loadBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        console.log('Brands', res);
        this.response = res;
      },
      error: console.error,
    });
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        console.log('Departments', res);
        this.response = res;
      },
      error: console.error,
    });
  }

  loadFighters() {
    this.fighterService.getAllFighters().subscribe({
      next: (res) => {
        console.log('Fighters', res);
        this.response = res;
      },
      error: console.error,
    });
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (res) => {
        console.log('Events', res);
        this.response = res;
      },
      error: console.error,
    });
  }
}