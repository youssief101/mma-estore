import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCarousel } from '../../../carousel/components/home-carousel/home-carousel';
import { CarouselSlide } from '../../../../core/models/carousel-slide.model';
import { HomeHero } from './home-hero/home-hero';
import { FeaturedFightersComponent } from './featured-fighters/featured-fighters';
import { FeaturedProductsComponent } from './featured-products/featured-products';
import { FeaturedCategories } from './featured-categories/featured-categories';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        HomeCarousel,
        HomeHero,
        FeaturedFightersComponent,
        FeaturedProductsComponent,
        FeaturedCategories
    ],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home {

  slides: CarouselSlide[] = [
    {
      id: '1',
      image: '/banners/banner1.jpg',
      title: 'UFC Collection',
      subtitle: 'Latest MMA Gear'
    },
    {
      id: '2',
      image: '/banners/banner2.jpg',
      title: 'Training Equipment',
      subtitle: 'Train Like a Champion'
    },
    {
      id: '3',
      image: '/banners/banner3.jpg',
      title: 'Official Apparel',
      subtitle: 'New Arrivals'
    }
  ];

}