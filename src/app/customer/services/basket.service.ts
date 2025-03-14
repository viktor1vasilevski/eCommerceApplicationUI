import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  basketCountSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  basketItemsCount: number = 0;
  basketItemsList: any[] = [];

  constructor() { }


  updateLocalBasketCount(product: any, quantity: number): void {
    let basketItems = JSON.parse(localStorage.getItem('basket') || '[]');
  
    let productExists = false;
    
    for (let index = 0; index < basketItems.length; index++) {
      if (product.id === basketItems[index].id) {
        basketItems[index].quantity += quantity;
        productExists = true;
        break;
      }
    }
  
    if (!productExists) {
      product.quantity = quantity;
      basketItems.push(product);
    }
  
    this.basketItemsCount = basketItems.length
    localStorage.setItem('basket', JSON.stringify(basketItems));
  
    this.basketCountSubject.next(basketItems);
  }
  
}
