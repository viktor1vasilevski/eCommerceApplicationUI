import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private baseUrl = environment.apiUrl;

  basketCountSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  basketItemsCount: number = 0;
  basketItemsList: any[] = [];

  constructor(private _dataApiService: DataService) {}


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

  getLocalBasket(): any {
    const localBasket = localStorage.getItem('basket');
    return localBasket ? JSON.parse(localBasket) : { products: [] };
  }
  
  mergeBasketWithUser(userId: string): Observable<any> {
    debugger
    const localBasket = this.getLocalBasket();

      // Ensure the structure matches AddToBasketRequest
    const requestPayload = {
      userId: userId,  // Explicitly set userId
      items: localBasket.map((product: any) => ({
        productId: product.id,   // Map the product ID correctly
        quantity: product.quantity // Ensure quantity exists
      }))
    };

    debugger
    return this._dataApiService.create<any, any>(`${this.baseUrl}/userbasket/ManageBasketByUserId/${userId}`, requestPayload);
  }

  setBasketItems(items: any) {
    this.basketCountSubject.next(items);
  }
  
}
