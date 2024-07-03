import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})

export class LandingComponent {
  constructor(private authService: AuthService, private router: Router) { };

  onProfileButtonClick() {
    this.router.navigate(['/profile']);
  }

  onLogoutButtonClick() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  onMapButtonClick() {
    this.router.navigate(['/map']);
  }

  onForumButtonClick() {
    this.router.navigate(['/forum']);
  }

  onAIButtonClick() {
    this.router.navigate(['/ai']);
  }
}
