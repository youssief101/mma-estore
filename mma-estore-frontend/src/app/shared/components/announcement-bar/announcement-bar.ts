import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.css'
})
export class AnnouncementBar {

  @Input()
  message =
    'FREE SHIPPING ON ORDERS OVER $99';

  @Input()
  background =
    'var(--color-primary)';

  @Input()
  color =
    '#ffffff';

}