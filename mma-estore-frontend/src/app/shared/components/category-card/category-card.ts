import {
  Component,
  input,
  output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Card
} from '../card/card';

import {
  CategoryCardModel
} from '../../models/category-card.model';

@Component({

  selector: 'app-category-card',

  standalone: true,

  imports: [
    CommonModule,
    Card
  ],

  templateUrl: './category-card.html',

  styleUrl: './category-card.css'

})

export class CategoryCard {

  readonly category =
    input.required<CategoryCardModel>();

  readonly categoryClick =
    output<string>();

  onClick(): void {

    this.categoryClick.emit(
      this.category().id
    );

  }

}