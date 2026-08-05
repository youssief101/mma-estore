import {
    Component,
    Input,
    OnInit,
    OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CarouselSlide } from '../../../../core/models/carousel-slide.model';

@Component({
    selector: 'app-home-carousel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home-carousel.html',
    styleUrl: './home-carousel.css',
})
export class HomeCarousel implements OnInit, OnDestroy {

    @Input() slides: CarouselSlide[] = [];

    @Input() autoplay = true;

    @Input() interval = 5000;

    currentIndex = 0;

    private timer?: ReturnType<typeof setInterval>;

    ngOnInit(): void {

        if (this.autoplay) {
            this.startAutoplay();
        }

    }

    ngOnDestroy(): void {

        this.stopAutoplay();

    }

    next(): void {

        this.currentIndex =
            (this.currentIndex + 1) % this.slides.length;

    }

    previous(): void {

        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length) %
            this.slides.length;

    }

    goTo(index: number): void {

        this.currentIndex = index;

    }

    private startAutoplay(): void {

        this.timer = setInterval(() => {

            this.next();

        }, this.interval);

    }

    private stopAutoplay(): void {

        if (this.timer) {

            clearInterval(this.timer);

        }

    }

}