import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  readonly drawerOpen = signal(false);

  constructor() {

    effect(() => {

      if (this.drawerOpen()) {

        document.body.style.overflow = 'hidden';

      } else {

        document.body.style.overflow = '';

      }

    });

  }

  openDrawer(): void {

    this.drawerOpen.set(true);

  }

  closeDrawer(): void {

    this.drawerOpen.set(false);

  }

  toggleDrawer(): void {

    this.drawerOpen.update(value => !value);

  }

}
