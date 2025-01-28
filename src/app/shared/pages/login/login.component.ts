import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthManagerService } from '../../services/auth-manager.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ApiResponse } from '../../../core/models/responses/api-response';
import { LoginDTO } from '../../models/auth/login-dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoading: boolean = false;
  loginForm: FormGroup;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';
  @ViewChild('passwordInput') passwordInput!: ElementRef;

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

    this._authManagerService.getUsernameForLogin$.subscribe(username => {
      if(username != "") {
        this.loginForm.patchValue({username: username})
        setTimeout(() => this.passwordInput?.nativeElement.focus(), 0);
      }

    })
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginForm = this.loginForm.value;
      this._authService.loginUser(loginForm)
        .subscribe({
          next: (response: ApiResponse<LoginDTO>) => {
            if(response && response.success) {
              const token = response.data?.token;
              const role = response.data?.role;
              const username = response.data?.username;

              role === 'Admin'
              ? this.router.navigate(['/admin/users'])
              : this.router.navigate(['/customer/orders']);

              this.isLoading = false;
  
              this._authManagerService.setSession(token, role, username);
              this._authManagerService.setLoggedInState(true, role);              
              this._notificationService.success(response.message);
              this.loginForm.reset();
            } else {
              this.isLoading = false;
              this._notificationService.info(response.message);
            }
          },
          error: (errorResponse: ApiResponse<LoginDTO>) => {
            this.isLoading = false;
            this._errorHandlerService.handleErrors(errorResponse);
          }
        })
    } else {
      this.isLoading = false;
      this._notificationService.info("Invalid form");
    }
  }


}
