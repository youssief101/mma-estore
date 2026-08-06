import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.css',
})
export class HomeHero {

  @Input() title = '';

  @Input() subtitle = '';

  @Input() buttonText = 'Shop Now';

  @Input() image = '';

  @Input() link = '/products';
}