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
import { BasketService } from '../../../customer/services/basket.service';

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
    private router: Router,
    private _basketService: BasketService
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
    if (!this.loginForm.valid) {
      this._notificationService.info("Invalid form");
      return;
    }
    this.isLoading = true;
    const loginForm = this.loginForm.value;
  
    this._authService.loginUser(loginForm).subscribe({
      next: ({ data, success, message }: ApiResponse<LoginDTO>) => {
        this.isLoading = false;
        
        if (!success || !data) {
          this._notificationService.info(message);
          return;
        }
        const { token, role, username, email, id } = data;

        this._authManagerService.setSession(email, token, role, username, id);
        this._authManagerService.setLoggedInState(true, role);
        this._authManagerService.setUsernameAndEmail(username, email);
        this._notificationService.success(message);
        this.loginForm.reset();

        let localStorageItems = this._basketService.loadBasketFromStorage();
        const request = { items: localStorageItems };
        if(role == 'Customer' && localStorageItems.length > 0) {
          this._basketService.updateBasketForUser(id, request).subscribe({
            next: (response: any) => {
              this._basketService.updateBasketA(response.data);      
            },
            error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
          })
          
        }

        if(role == 'Customer' && localStorageItems.length == 0) {
          this._basketService.getBasketItemsByUserId(id).subscribe({
            next: (response: any) => {
              if(response && response.success && response.data) {
                this._basketService.updateBasketA(response.data);
              } else {
                this._notificationService.error(response.message);
              }
            },
            error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
          })
          
        }


  
        this.router.navigate([role === 'Admin' ? '/admin/categories' : '/home']);
      },
      error: (errorResponse: ApiResponse<LoginDTO>) => {
        this.isLoading = false;
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }
  


}
