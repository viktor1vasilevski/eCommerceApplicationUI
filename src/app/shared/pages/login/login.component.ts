import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthManagerService } from '../../services/auth-manager.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';

  constructor(private fb: FormBuilder,
    private _authService: AuthService,
    private _authManagerService: AuthManagerService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginForm = this.loginForm.value;
      this._authService.loginUser(loginForm)
        .subscribe({
          next: (response: any) => {
            debugger
            if(response && response.success) {
              const token = response.data.token;
              const role = response.data.role;
              const username = response.data.username;
              role == 'Admin' ? this.router.navigate(['/admin/users']) : this.router.navigate(['/customer/orders']);
  
              this._authManagerService.setSession(token, role, username);
              this._authManagerService.setLoggedInState(true, role);
              debugger

              this._notificationService.success(response.message);
            } else {
              this._notificationService.info(response.message);
            }
          },
          error: (errorResponse: any) => {
            this._errorHandlerService.handleErrors(errorResponse);
          }
        })
    } else {
      this._notificationService.info("Invalid form");
    }
  }


}
