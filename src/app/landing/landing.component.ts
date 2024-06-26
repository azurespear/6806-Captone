import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})

export class LandingComponent {
  constructor(private router: Router) { };

  onProfileButtonClick() {
    this.router.navigate(['/profile']);
  }

  onLogoutButtonClick() {
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
