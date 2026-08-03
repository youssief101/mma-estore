import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {

  query = '';

  @Output()
  search = new EventEmitter<string>();

  onSearch(): void {

    const value = this.query.trim();

    if (!value) {

      return;

    }

    this.search.emit(value);

  }

}