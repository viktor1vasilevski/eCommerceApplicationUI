import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { CommonModule } from '@angular/common';

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

  constructor(private _basketService: BasketService) {

  }


  ngOnInit(): void {
    this.basketItems = this._basketService.loadBasketFromStorage();
  }

  onRemove(item: any) {

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


