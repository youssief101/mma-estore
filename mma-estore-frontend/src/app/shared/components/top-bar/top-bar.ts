import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopBarService } from '../../../core/services/top-bar.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar implements OnInit {
  @Output() openRegister = new EventEmitter<void>();
  showPromo = true;

  constructor(private topBarService: TopBarService) {}

  ngOnInit(): void {
    this.topBarService.showPromo$.subscribe((show) => {
      this.showPromo = show;
    });
  }
}
