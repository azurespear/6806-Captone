import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showContent: string = 'profile';
  
  switchContent(content: string) {
    this.showContent = content;
  }

  email: string = '';
  username: string = '';
  password: string = '';

}
