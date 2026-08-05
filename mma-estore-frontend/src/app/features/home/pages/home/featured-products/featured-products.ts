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
import { RouterLink } from '@angular/router';

// Import Swiper registration
import { register } from 'swiper/element/bundle';
import { ProductService } from '../../../../../../services/product.service';
import { Product } from '../../../../../../models/product.model';

register();

@Component({
    selector: 'app-featured-products',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './featured-products.html',
    styleUrl: './featured-products.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeaturedProductsComponent implements OnInit {
    private productService = inject(ProductService);
    private cdr = inject(ChangeDetectorRef);

    readonly JSON = JSON;
    products: Product[] = [];
    loading = true;

    // Swiper Breakpoints
    swiperBreakpoints = {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 }
    };

    @ViewChild('productsSwiper') swiper!: ElementRef;

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.productService.getFeaturedProducts().subscribe({
            next: (response) => {
                this.products = response?.products || [];
                this.loading = false;
                
                this.cdr.detectChanges();

                // Refresh Swiper after DOM updates
                setTimeout(() => {
                    if (this.swiper?.nativeElement?.swiper) {
                        this.swiper.nativeElement.swiper.update();
                    }
                }, 100);
            },
            error: err => {
                console.error('Error fetching products:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getMainImage(product: Product): string {
        if (!product.images || !product.images.length) {
            return '/images/product-placeholder.png';
        }
        const primary = product.images.find(i => i.isPrimary);
        const image = primary ?? product.images[0];
        if (image.url.startsWith('http') || image.url.startsWith('/')) {
            return image.url;
        }
        return `/${image.url}`;
    }
}