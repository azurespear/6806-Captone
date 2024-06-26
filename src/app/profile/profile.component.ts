import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
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
}
