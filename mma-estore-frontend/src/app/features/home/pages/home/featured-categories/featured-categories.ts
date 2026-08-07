import { 
  Component, 
  OnInit, 
  inject, 
  ChangeDetectorRef, 
  ElementRef, 
  ViewChild, 
  CUSTOM_ELEMENTS_SCHEMA 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { CategoryService } from '../../../../../../services/category.service';
import { Category } from '../../../../../../models/category.model';
import { CategoryCardModel } from '../../../../../core/models/category-card.model';

// Register Swiper Custom Elements
register();

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-categories.html',
  styleUrl: './featured-categories.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Critical for swiper-container
})
export class FeaturedCategories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = true;
  cards: CategoryCardModel[] = [];

  @ViewChild('categoriesSwiper') swiper!: ElementRef;

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response?.categories) {
          this.cards = response.categories.map((cat: Category) => ({
            id: cat._id,
            name: cat.name,
            image: this.formatImagePath(cat.image),
            description: cat.description
          }));
        }
        this.loading = false;
        
        // Force the view to update with new data
        this.cdr.detectChanges();

        // Tell Swiper to recalculate slides
        setTimeout(() => {
          if (this.swiper?.nativeElement?.swiper) {
            this.swiper.nativeElement.swiper.update();
          }
        }, 100);
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatImagePath(path: string): string {
    if (!path) return '/images/placeholder.png';
    return (path.startsWith('http') || path.startsWith('/')) ? path : `/${path}`;
  }

  selectCategory(card: CategoryCardModel): void {
    this.router.navigate(['/products'], {
      queryParams: { category: card.name || card.id }
    });
  }
}