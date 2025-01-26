import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user = {
    username: '',
    password: ''
  };

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      console.log('Form Submitted:', this.user);
      // Logic to authenticate the user and handle login
    }
  }

}
