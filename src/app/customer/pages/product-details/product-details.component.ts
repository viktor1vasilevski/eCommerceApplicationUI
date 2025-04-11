import { Component } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { Router } from '@angular/router';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  
  product: any;
  selectedQuantity: number = 1;

  constructor(private router: Router, private _basketService: BasketService,
    private _authManagerService: AuthManagerService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {

    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state?.['product'] || null;
  }

  addToBasket(product: any) {
    debugger
    if(this._authManagerService.isLoggedIn()) {
      
      let userId = this._authManagerService.getUserId();
      const request = { items: [{ productId: product.id, quantity: this.selectedQuantity }] };

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
      this._basketService.addItem(product.id, product.name, product.unitPrice, product.imageBase64, this.selectedQuantity);
      this._notificationService.success('Item added to your basket!');
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
