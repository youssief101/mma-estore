import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { SearchBar } from '../search-bar/search-bar';

@Component({

  selector: 'app-header',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    SearchBar
  ],

  templateUrl: './header.html',

  styleUrl: './header.css'

})
export class Header {

  @Input()
  cartCount = 0;

}