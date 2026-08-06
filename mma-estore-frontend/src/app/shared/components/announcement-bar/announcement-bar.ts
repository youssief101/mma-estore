import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../../core/services/announcement.service';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.css',
})
export class AnnouncementBar implements OnInit {
  @Input() message = 'SIGN UP & SAVE 10%';
  @Input() background = 'var(--color-primary, #d20a11)';
  @Input() color = 'white';

  isVisible = true;

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.announcementService.showBar$.subscribe((show) => {
      this.isVisible = show;
    });
  }
}
