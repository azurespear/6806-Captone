import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, 
    private router: Router,
    private dialog: MatDialog) { }

  onLoginButtonClick(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/landing']); // Navigate to the profile page upon successful login
      },
      error => {
        this.openErrorDialog(error.message || 'Login failed. Please try again.');
        console.error('Error logging in', error);
      }
    );
  }

  onSignUpButtonClick() {
    this.router.navigate(['/reg']);
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message }
    });
  }

} 

