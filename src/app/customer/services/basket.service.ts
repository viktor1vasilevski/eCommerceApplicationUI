import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';
import { AuthService } from '../../shared/services/auth.service';
import { AuthManagerService } from '../../shared/services/auth-manager.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private baseUrl = environment.apiUrl;

  basketCountSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  resetBasketSubject: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  basketItemsCount: number = 0;
  basketItemsList: any[] = [];

  constructor(private _dataApiService: DataService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {


  }


  decreaseQuantity(product: any, userId: string | null): void {


    let basketItems = JSON.parse(localStorage.getItem('basket') || '[]');
  
    for (let index = 0; index < basketItems.length; index++) {
      if (basketItems[index].id === product.id) {
        basketItems[index].quantity--;
        break;
      }
    }
  
    if(userId != undefined) {
      const requestPayload = {
        userId: userId,
        items: basketItems.map((product: any) => ({
          productId: product.id,
          quantity: product.quantity
        }))
      };

      this.manageBasketItemsByUserId(requestPayload).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this.setBasketItems(response.data);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })

    }


  
    this.setBasketItems(basketItems);
  }

  increseQuantity(product: any, userId: string | null): void {

    let basketItems = JSON.parse(localStorage.getItem('basket') || '[]');
  
    for (let index = 0; index < basketItems.length; index++) {
      if (basketItems[index].id === product.id) {
        basketItems[index].quantity++;
      }
    }
  
    if(userId != undefined) {
      const requestPayload = {
        userId: userId,
        items: basketItems.map((product: any) => ({
          productId: product.id,
          quantity: product.quantity
        }))
      };
      this.manageBasketItemsByUserId(requestPayload).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this.setBasketItems(response.data);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })

    }


  
    this.setBasketItems(basketItems);
  }

  updateLocalBasketCount(product: any, quantity: number, userId: string | null): void {
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

    if(userId != undefined) {
      const requestPayload = {
        userId: userId,
        items: basketItems.map((product: any) => ({
          productId: product.id,
          quantity: product.quantity
        }))
      };
      this.manageBasketItemsByUserId(requestPayload).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this.setBasketItems(response.data);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })

    }


  
    this.setBasketItems(basketItems);
  }

  getLocalBasket(): any {
    const localBasket = localStorage.getItem('basket');
    return localBasket ? JSON.parse(localBasket) : null
  }

  
  manageBasketItemsByUserId(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(`${this.baseUrl}/userbasket/manageBasketItemsByUserId`, request);
  }

  getBasketItemsByUserId(userId: string | null): Observable<any> {
    return this._dataApiService.getById<any>(`${this.baseUrl}/userBasket/getBasketItemsByUserId/${userId}`);
  }

  setBasketItems(items: any) {
    localStorage.setItem('basket', JSON.stringify(items));
    this.basketItemsList = items;
    this.basketCountSubject.next(items);
  }

  getBasketItems() {
    return this.basketItemsList;
  }
  
}
