import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.css'
})
export class RegComponent {  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private dialog: MatDialog
  ) { }
  
  email: string = '';
  username: string = '';
  password: string = '';
  repeatPassword: string = '';

  onSignUpButtonClick(): void {
    if (this.password != this.repeatPassword){
      this.openErrorDialog('Passwords do not match');
      return;
    }

    if (this.password == ''){
      this.openErrorDialog('Need password');
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['']); // Navigate to the login page upon successful registration
      },
      error => {
        this.openErrorDialog(error.message || 'Registration failed. Please try again.');
        console.error('Error registering', error);
      }
    );
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message }
    });
  }
}
