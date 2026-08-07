import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// 1. Import and register Swiper Web Components
import { register } from 'swiper/element/bundle';
import { FighterService } from '../../../../../../services/fighter.service';
import { Fighter } from '../../../../../../models/fighter.model';

register();

@Component({
  selector: 'app-featured-fighters',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-fighters.html',
  styleUrl: './featured-fighters.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturedFightersComponent implements OnInit, AfterViewInit {
  private fighterService = inject(FighterService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // 2. EXPOSE JSON TO THE TEMPLATE
  readonly JSON = JSON;

  fighters: Fighter[] = [];
  loading = true;

  // 3. Define breakpoints as an object
  swiperBreakpoints = {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1400: { slidesPerView: 4 }
  };

  @ViewChild('fightersSwiper') swiper!: ElementRef;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.loadFighters();
  }

  loadFighters(): void {
    this.loading = true;
    this.fighterService.getAllFighters().subscribe({
      next: (response) => {
        const sorted = [...response.fighters].sort((a, b) => {
          if (a.champion && !b.champion) return -1;
          if (!a.champion && b.champion) return 1;
          return (a.ranking ?? 999) - (b.ranking ?? 999);
        });

        this.fighters = sorted;
        this.loading = false;
        
        // Ensure Angular detects the data change so *ngIf reveals the swiper
        this.cdr.detectChanges();

        // Update the swiper instance manually after the DOM updates
        setTimeout(() => {
          if (this.swiper?.nativeElement?.swiper) {
            this.swiper.nativeElement.swiper.update();
          }
        }, 100);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  getImage(image: string): string {
    if (!image) return '/images/placeholder-fighter.png';
    if (image.startsWith('http') || image.startsWith('/')) return image;
    return `/${image}`;
  }

  shopFighter(fighter: Fighter): void {
    const name = `${fighter.firstName} ${fighter.lastName}`.trim();
    this.router.navigate(['/products'], {
      queryParams: { fighter: fighter._id || name }
    });
  }
}