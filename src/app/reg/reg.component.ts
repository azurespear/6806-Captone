import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.css'
})
export class RegComponent {
  constructor(private router: Router) { };
  email: string = '';
  username: string = '';
  password: string = '';

  onSignUpButtonClick() {
    this.router.navigate(['/reg']);
  }

}
