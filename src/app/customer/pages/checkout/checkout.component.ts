import { Component, OnInit } from '@angular/core';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  isLogged: boolean = false;

  constructor(private router: Router,
    private _authManagerService: AuthManagerService,
    private _basketService: BasketService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {

  }

  ngOnInit(): void {
    this.isLogged = this._authManagerService.isLoggedIn();

    if(this.isLogged){
      let userId = this._authManagerService.getUserId();

      this._basketService.removeAllBasketItemsForUser(userId).subscribe({
        next: (response: any) => {
          if(response && response.success) {
            this._basketService.clearBasket();
            this.router.navigate(['/home']);
            this._notificationService.success(response.message);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
      })

    }
  }



}
