import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {

  basketItems: any[] = [];
  constructor(private _basketService: BasketService,
    private _authManagerService: AuthManagerService
  ) {

    this._basketService.basketCountSubject.subscribe(stat => {
      this.basketItems = stat;
    })
  }

  ngOnInit(): void {
    this.basketItems = this._basketService.getLocalBasket();
    console.log(this.basketItems);
    
  }



  getTotal(): number {
    return this.basketItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  increaseQuantity(item: any): void {

    let userId = this._authManagerService.getUserId();
    this._basketService.increseQuantity(item, userId)
  }

  decreaseQuantity(item: any): void {

    let userId = this._authManagerService.getUserId();

    this._basketService.decreaseQuantity(item, userId)
  }

  removeFromBasket(item: any): void {
      this.basketItems = this.basketItems.filter(b => b !== item);
  }

  checkout(): void {

      // Implement checkout logic
  }

}
