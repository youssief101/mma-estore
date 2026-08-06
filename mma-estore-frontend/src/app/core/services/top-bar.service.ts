import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TopBarService {
  private showPromoSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('registered') !== 'true',
  );
  showPromo$ = this.showPromoSubject.asObservable();

  hidePromo(): void {
    localStorage.setItem('registered', 'true');
    this.showPromoSubject.next(false);
  }
}
