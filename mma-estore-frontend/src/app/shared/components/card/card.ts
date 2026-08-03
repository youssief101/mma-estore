import {
  Component,
  input
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {

  readonly hover =
    input(true);

  readonly bordered =
    input(false);

  readonly clickable =
    input(false);

  readonly shadow =
    input<'none' | 'sm' | 'md' | 'lg'>('md');

  readonly padding =
    input<'none' | 'sm' | 'md' | 'lg'>('md');

}