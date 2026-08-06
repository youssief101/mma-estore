import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Card } from '../card/card';
import { Button } from '../button/button';

import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Card,
    Button
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  readonly product = input.required<Product>();

  readonly addToCart = output<Product>();

}
