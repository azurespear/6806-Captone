import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // Correct property name
})
export class ProfileComponent implements OnInit {
  showContent: string = 'profile';
  email: string = '';
  username: string = '';
  password: string = '';
  repeatPassword: string = '';

  userData: any;

  constructor(private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserData().subscribe(
      data => {
        this.userData = data;
        this.email = data.userEmail;
        this.username = data.userName;
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  confirmEdit(content: string): void {
    if (this.password != this.repeatPassword){
      this.openErrorDialog('Passwords do not match.');
      return;
    }

    const updatedData = {
      userName: this.username,
      password: this.password,
      userEmail: this.email
    };

    this.userService.updateUser(updatedData).subscribe(
      response => {
        console.log('User data updated successfully', response);
        this.showContent = content;
        this.loadUserData(); // Refresh the data after update
      },
      error => {
        console.error('Error updating user data', error);
        const errorMessage = error.extractedMessage || 'Error updating user data.';
        this.openErrorDialog(errorMessage);
      }
    );
  }
  
  cancelEdit(content: string): void {
    this.showContent = content;
    this.loadUserData();
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message }
    });
  }

  goToEdit(content: string): void {
    this.showContent = content;
  }

  onLogoutButtonClick() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}

