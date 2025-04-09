import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { CommonModule } from '@angular/common';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-basket-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket-items.component.html',
  styleUrl: './basket-items.component.css'
})
export class BasketItemsComponent implements OnInit {

  basketItems: any;
  selectedQuantity: number = 1;
  product: any;

  constructor(private _basketService: BasketService,
    private _authManagerService: AuthManagerService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {
    this._basketService.basket$.subscribe(items => this.basketItems = items)
  }


  ngOnInit(): void {
    this.basketItems = this._basketService.loadBasketFromStorage();
  }

  removeFromBasket(item: any) {
   let role = this._authManagerService.getRole();
   if(role == 'Customer') {
    if(this._authManagerService.isLoggedIn()) {
      this._basketService.removeBasketItemsForUser(this._authManagerService.getUserId(), item.id).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this._basketService.updateBasketA(response.data);
            this._notificationService.success(response.message);
          } else {
            this._notificationService.error(response.message);
          }
          
        },
        error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
      })
    } else {
      this._basketService.removeItem(item.productId)
    }
   }

   
  }

  updateQuantity(action: string) {

    if (action === 'increase') {
      if (this.selectedQuantity < this.product.unitQuantity) {
        this.selectedQuantity++;
      }
    } else if (action === 'decrease') {
      if (this.selectedQuantity > 1) {
        this.selectedQuantity--;
      }
    }
  }

}


