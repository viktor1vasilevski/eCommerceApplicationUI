import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  };


  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      console.log('Form Submitted:', this.user);
      // Logic to send the user data to the backend
    }
  }

}
