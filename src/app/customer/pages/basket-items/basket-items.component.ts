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
    console.log(this.basketItems);
    
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
    } 
   } else {
    this._basketService.removeItem(item.productId)
   }

   
  }

  getTotalAmount(): number {
    return this.basketItems.reduce((sum: number, item: any) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
  }
  

  proceedToCheckout() {
    // Navigate or open checkout page/modal
    console.log("Proceeding to checkout...");
  }
  
  

  updateQuantity(item: any, action: string) {
    let quantityChange = action === 'increase' ? 1 : -1;
    if(this._authManagerService.isLoggedIn()) {
      let userId = this._authManagerService.getUserId();

      
  
      const request = {items: [{ productId: item.id, quantity: quantityChange }]};
  
      this._basketService.updateBasketForUser(userId, request).subscribe({
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
      debugger
      this._basketService.addItem(item.productId, item.name, item.unitPrice, item.imageBase64, quantityChange);
      this._notificationService.success('Your basket has been updated.');
    }
    
  }

}


