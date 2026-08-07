import {
  Component,
  EventEmitter,
  Output,
  inject,
  HostListener,
  ElementRef,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { Product } from '../../../../models/product.model';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private elementRef = inject(ElementRef);

  query = '';
  selectedCategory = 'all';
  categories: { id: string; name: string }[] = [];
  suggestions: Product[] = [];
  showDropdown = false;
  isSearching = false;

  private searchSubject = new Subject<string>();

  @Output() search = new EventEmitter<string>();

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        if (res.categories) {
          this.categories = res.categories.map(c => ({ id: c.name, name: c.name }));
        }
      },
      error: () => {}
    });

    this.searchSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.trim().length < 1) {
          this.isSearching = false;
          return of({ products: [] });
        }
        this.isSearching = true;
        const filterParams: Record<string, any> = { search: term.trim() };
        if (this.selectedCategory !== 'all') {
          filterParams['category'] = this.selectedCategory;
        }
        return this.productService.filterProducts(filterParams);
      })
    ).subscribe({
      next: (res: any) => {
        this.suggestions = (res?.products || []).slice(0, 6);
        this.isSearching = false;
        this.showDropdown = this.query.trim().length >= 1;
      },
      error: () => {
        this.suggestions = [];
        this.isSearching = false;
        this.showDropdown = this.query.trim().length >= 1;
      }
    });
  }

  onInput(): void {
    if (!this.query.trim()) {
      this.suggestions = [];
      this.showDropdown = false;
    }
    this.searchSubject.next(this.query);
  }

  onFocus(): void {
    if (this.query.trim().length >= 1) {
      this.showDropdown = true;
    }
  }

  selectSuggestion(product: Product): void {
    this.showDropdown = false;
    this.query = '';
    this.router.navigate(['/products', product._id]);
  }

  onSearch(): void {
    const value = this.query.trim();
    this.showDropdown = false;

    const queryParams: Record<string, string> = {};
    if (value) queryParams['search'] = value;
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      queryParams['category'] = this.selectedCategory;
    }

    this.router.navigate(['/products'], { queryParams });
    this.search.emit(value);
  }

  getProductImage(product: Product): string {
    if (!product.images?.length) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop';
    const primary = product.images.find(img => img.isPrimary);
    const url = primary ? primary.url : product.images[0].url;
    if (!url) return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&auto=format&fit=crop';
    return url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}