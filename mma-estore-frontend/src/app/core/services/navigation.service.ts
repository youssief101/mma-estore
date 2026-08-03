import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  readonly drawerOpen = signal(false);

  toggleDrawer(): void {

    this.drawerOpen.update(value => !value);

  }

  closeDrawer(): void {

    this.drawerOpen.set(false);

  }

  openDrawer(): void {

    this.drawerOpen.set(true);

  }

}
