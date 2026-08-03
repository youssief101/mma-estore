import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchBar } from '../search-bar/search-bar';

import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    SearchBar
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(
    public navigation: NavigationService
  ) {}

}
