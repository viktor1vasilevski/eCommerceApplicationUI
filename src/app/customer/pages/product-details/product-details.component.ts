import { Component } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { Router } from '@angular/router';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';
import { NotificationService } from '../../../core/services/notification.service';

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
    private _notificationService: NotificationService
  ) {

    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state?.['product'] || null;
  }

  addToBasket(product: any) {

    if(this._authManagerService.isLoggedIn()) {
      console.log('user is logged');
      
    } else {
      this._basketService.addItem(product.id, product.unitPrice, product.imageBase64, this.selectedQuantity);
    }

    this._notificationService.success('Item added to your basket!')

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
