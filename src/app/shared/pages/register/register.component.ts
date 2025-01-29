import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ApiResponse } from '../../../core/models/responses/api-response';
import { RegisterDTO } from '../../models/auth/register-dto';
import { AuthManagerService } from '../../services/auth-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isLoading: boolean = false;
  registerForm: FormGroup;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+$';

  constructor(private fb: FormBuilder,
    private _authService: AuthService,
    private _authManagerService: AuthManagerService,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
    });
  }


  onRegister() {
    if (!this.registerForm.valid) {
      this._notificationService.info("Invalid form");
      return;
    }
  
    this.isLoading = true;
    const registerForm = this.registerForm.value;
  
    this._authService.registerUser(registerForm).subscribe({
      next: ({ data, success, message }: ApiResponse<RegisterDTO>) => {
        debugger
        this.isLoading = false;
  
        if (!success || !data?.username) {
          this._notificationService.info(message);
          return;
        }
  
        this._authManagerService.setUsername(data.username);
        this._notificationService.success(message);
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (errorResponse: ApiResponse<RegisterDTO>) => {
        this.isLoading = false;
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }
  


}
