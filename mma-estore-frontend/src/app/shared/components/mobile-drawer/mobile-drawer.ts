import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-drawer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './mobile-drawer.html',
  styleUrl: './mobile-drawer.css'
})
export class MobileDrawer {

  @Input() open = false;

}
