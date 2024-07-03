import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.css'
})
export class RegComponent {  
  constructor(private authService: AuthService, private router: Router) { }
  email: string = '';
  username: string = '';
  password: string = '';

  onSignUpButtonClick(): void {
    this.authService.register(this.username, this.email, this.password).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['']); // Navigate to the login page upon successful registration
      },
      error => {
        console.error('Error registering', error);
      }
    );
  }
}
