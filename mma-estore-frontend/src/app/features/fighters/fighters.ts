import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FighterService } from '../../../services/fighter.service';
import { Fighter } from '../../../models/fighter.model';

@Component({
  selector: 'app-fighters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fighters.html',
  styleUrl: './fighters.css'
})
export class Fighters implements OnInit {
  private fighterService = inject(FighterService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  fighters: Fighter[] = [];
  filteredFighters: Fighter[] = [];
  loading = true;
  errorMessage = '';

  searchTerm = '';
  selectedWeightClass = 'all';
  championsOnly = false;

  weightClasses: string[] = [
    'all',
    'Heavyweight',
    'Light Heavyweight',
    'Middleweight',
    'Welterweight',
    'Lightweight',
    'Featherweight',
    'Bantamweight',
    'Flyweight'
  ];

  ngOnInit(): void {
    this.loadFighters();
  }

  loadFighters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.fighterService.getAllFighters().subscribe({
      next: (res) => {
        this.fighters = res.fighters || [];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fighters fetch error:', err);
        this.errorMessage = 'Failed to load UFC fighters roster. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let result = [...this.fighters];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(f => 
        f.firstName.toLowerCase().includes(term) ||
        f.lastName.toLowerCase().includes(term) ||
        (f.nickname && f.nickname.toLowerCase().includes(term)) ||
        (f.weightClass && f.weightClass.toLowerCase().includes(term)) ||
        (f.country && f.country.toLowerCase().includes(term))
      );
    }

    if (this.selectedWeightClass !== 'all') {
      result = result.filter(f => 
        f.weightClass && f.weightClass.toLowerCase() === this.selectedWeightClass.toLowerCase()
      );
    }

    if (this.championsOnly) {
      result = result.filter(f => f.champion);
    }

    this.filteredFighters = result;
  }

  onSearch(): void {
    this.applyFilters();
  }

  selectWeightClass(wc: string): void {
    this.selectedWeightClass = wc;
    this.applyFilters();
  }

  toggleChampions(): void {
    this.championsOnly = !this.championsOnly;
    this.applyFilters();
  }

  viewFighterGear(fighter: Fighter, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/products'], { queryParams: { fighter: fighter._id } });
  }

  getFighterImage(fighter: Fighter): string {
    if (!fighter.image) {
      return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop';
    }
    return fighter.image.startsWith('http') || fighter.image.startsWith('/') 
      ? fighter.image 
      : `/${fighter.image}`;
  }
}
