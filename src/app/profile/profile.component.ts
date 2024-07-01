import { Component, OnInit  } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  showContent: string = 'profile';
  email: string = '';
  username: string = '';
  password: string = '';
  
  confirmEdit(content: string) {
    console.log(this.email);
    console.log(this.username);
    console.log(this.password);
    this.showContent = content;
  }

  goToEdit(content: string) {
    this.showContent = content;
  }

  userData: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userId = '0'; // Replace with the actual user ID
    this.loadUserData(userId);
  }

  loadUserData(userId: string): void {
    this.userService.getUserData(userId).subscribe(
      data => {
        this.userData = data;
      },
      error => {
        console.error('Error fetching user data', error);
      }
    );
  }

  // updateUserProfile(userProfile: any): void {
  //   const userId = '12345'; // Replace with the actual user ID
  //   this.userService.updateUserProfile(userId, userProfile).subscribe(
  //     response => {
  //       console.log('User profile updated successfully', response);
  //     },
  //     error => {
  //       console.error('Error updating user profile', error);
  //     }
  //   );
  // }

}
