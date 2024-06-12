import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  onLoginButtonClick() {
    console.log('Login button was clicked!');
    alert('Login button was clicked!');
  }
} 
