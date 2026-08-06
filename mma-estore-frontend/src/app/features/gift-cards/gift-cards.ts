import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gift-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gift-cards.html',
  styleUrl: './gift-cards.css',
})
export class GiftCards {}
