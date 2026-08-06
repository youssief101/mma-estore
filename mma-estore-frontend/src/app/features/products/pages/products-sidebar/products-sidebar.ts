import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs'; // To clean up the listener

import { CategoryService } from '../../../../../services/category.service';
import { FighterService } from '../../../../../services/fighter.service';
import { EventService } from '../../../../../services/event.service';
import { BrandService } from '../../../../../services/brand.service';
import { DepartmentService } from '../../../../../services/department.service';

import { FilterSection, FilterItem } from '../filter-section/filter-section';

@Component({
  selector: 'app-products-sidebar',
  standalone: true,
  imports: [CommonModule, FilterSection],
  templateUrl: './products-sidebar.html',
  styleUrl: './products-sidebar.css'
})
export class ProductsSidebar implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly categoryService = inject(CategoryService);
  private readonly fighterService = inject(FighterService);
  private readonly brandService = inject(BrandService);
  private readonly departmentService = inject(DepartmentService);
  private readonly eventService = inject(EventService);

  private routeSub!: Subscription;
  private currentParams: any = {};

  categories: FilterItem[] = [];
  fighters: FilterItem[] = [];
  brands: FilterItem[] = [];
  departments: FilterItem[] = [];
  events: FilterItem[] = [];

  ngOnInit(): void {
    this.loadAllFilters();

    // CRITICAL: Watch the URL continuously, not just once!
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.currentParams = params;
      this.cdr.detectChanges(); // Tell Angular to redraw checkboxes
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  private loadAllFilters(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => { this.categories = res.categories.map(c => ({ id: c._id, name: c.name })); this.cdr.detectChanges(); }
    });
    this.fighterService.getAllFighters().subscribe({
      next: (res) => { this.fighters = res.fighters.map(f => ({ id: f._id, name: `${f.firstName} ${f.lastName}` })); this.cdr.detectChanges(); }
    });
    this.brandService.getAllBrands().subscribe({
      next: (res) => { this.brands = res.brands.map(b => ({ id: b._id, name: b.name })); this.cdr.detectChanges(); }
    });
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => { this.departments = res.departments.map(d => ({ id: d._id, name: d.name })); this.cdr.detectChanges(); }
    });
    this.eventService.getAllEvents().subscribe({
      next: (res) => { this.events = res.events.map(e => ({ id: e._id, name: e.name })); this.cdr.detectChanges(); }
    });
  }

  // Use currentParams instead of snapshot
  public getActiveIds(key: string): string[] {
    const val = this.currentParams[key];
    if (!val) return [];
    return Array.isArray(val) ? val : val.split(',');
  }

  public toggleFilter(key: string, id: string): void {
    let active = this.getActiveIds(key);
    
    if (active.includes(id)) {
      active = active.filter(item => item !== id);
    } else {
      active = [...active, id];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: active.length ? active.join(',') : null },
      queryParamsHandling: 'merge',
    });
  }
}