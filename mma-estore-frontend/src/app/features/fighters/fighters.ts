import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fighters',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fighters.html',
  styleUrl: './fighters.css',
})
export class Fighters {}
