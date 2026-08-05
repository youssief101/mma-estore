import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.css',
})
export class AnnouncementBar {
  @Input() message = 'SIGN UP & SAVE 10%';
  @Input() background = 'var(--color-primary, #d20a11)';
  @Input() color = 'white';
}
