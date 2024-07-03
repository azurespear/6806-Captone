import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

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

  userData: any;

  constructor(private userService: UserService, private authService: AuthService) { }

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
    const updatedData = {
      userName: this.username,
      password: this.password,
      userEmail: this.email
    };

    console.log('Updated Data:', updatedData); // Log the data to check its format

    this.userService.updateUser(updatedData).subscribe(
      response => {
        console.log('User data updated successfully', response);
        this.showContent = content;
        this.loadUserData(); // Refresh the data after update
      },
      error => {
        console.error('Error updating user data', error);
      }
    );
  }

  goToEdit(content: string): void {
    this.showContent = content;
  }
}

