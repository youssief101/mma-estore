import { Component, inject, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.authService.loadCurrentUser().subscribe({
      error: () => {
        this.authService.logout();
      },
    });
  }
}
