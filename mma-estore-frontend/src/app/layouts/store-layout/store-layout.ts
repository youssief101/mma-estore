import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopBar } from '../../shared/components/top-bar/top-bar';
import { AnnouncementBar } from '../../shared/components/announcement-bar/announcement-bar';
import { Header } from '../../shared/components/header/header';
import { MobileDrawer } from '../../shared/components/mobile-drawer/mobile-drawer';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';
import { RegisterModal } from '../../features/auth/pages/register/register';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TopBar,
    AnnouncementBar,
    Header,
    MobileDrawer,
    Navbar,
    Footer,
    RegisterModal
  ],
  templateUrl: './store-layout.html',
  styleUrl: './store-layout.css'
})
export class StoreLayout {

    constructor(
        public navigation: NavigationService
    ) {}

}
