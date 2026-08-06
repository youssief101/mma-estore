import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterModal } from '../../features/auth/pages/register/register';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RegisterModal],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout {
  showRegisterModal = false;
}
