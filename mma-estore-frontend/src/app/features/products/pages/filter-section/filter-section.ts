import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-filter-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-section.html',
  styleUrl: './filter-section.css'
})
export class FilterSection {
  readonly title = input.required<string>();
  readonly items = input<FilterItem[]>([]);
  
  // Array of currently selected IDs from the URL
  readonly activeIds = input<string[]>([]); 
  
  readonly itemToggled = output<string>();

  onToggle(id: string): void {
    this.itemToggled.emit(id);
  }
}