import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private showBarSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('registered') !== 'true',
  );
  showBar$ = this.showBarSubject.asObservable();

  hideBar(): void {
    localStorage.setItem('registered', 'true');
    this.showBarSubject.next(false);
  }
}
