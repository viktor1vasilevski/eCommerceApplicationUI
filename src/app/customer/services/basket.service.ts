import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { environment } from '../../../enviroments/enviroment.dev';

interface BasketItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  imageBase64: string;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private baseUrl = environment.apiUrl;

  private basketKey = 'basket';

  private basketSubject: BehaviorSubject<BasketItem[]> = new BehaviorSubject<BasketItem[]>(this.loadBasketFromStorage());
  basket$: Observable<BasketItem[]> = this.basketSubject.asObservable(); // Public observable

  constructor(private _dataApiService: DataService) {}

  getBasketItemsByUserId(userId: string | null): Observable<any> {
    const url = `${this.baseUrl}/userBasket/getBasketItemsByUserId/${userId}`;
    return this._dataApiService.getById<any>(url);
  }

  updateBasketForUser(userId: string | null, request: any): Observable<any> {
    const url = `${this.baseUrl}/userBasket/updateBasketForUser/${userId}`
    return this._dataApiService.create<any, any>(url, request);
  }

  removeBasketItemsForUser(userId: string | null, itemId: string): Observable<any> {
    const url = `${this.baseUrl}/userBasket/removeBasketItemsForUser/${userId}/${itemId}`;
    return this._dataApiService.delete<any>(url);
  }

  removeAllBasketItemsForUser(userId: string | null): Observable<any> {
    const url = `${this.baseUrl}/userBasket/removeAllBasketItemsForUser/${userId}`;
    return this._dataApiService.delete<any>(url);
  }

  loadBasketFromStorage(): BasketItem[] {
    const savedBasket = localStorage.getItem(this.basketKey);
    return savedBasket ? JSON.parse(savedBasket) : [];
  }

  private saveBasketToStorage(basket: BasketItem[]): void {
    localStorage.setItem(this.basketKey, JSON.stringify(basket));
  }

  addItem(productId: number, name: string, unitPrice: number, imageBase64: string, quantity: number = 1): void {
    const currentBasket = this.basketSubject.value;
    debugger
    const existingItem = currentBasket.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentBasket.push({ productId, unitPrice, imageBase64, quantity, name });
    }

    this.updateBasket(currentBasket);
  }

  removeItem(id: number): void {
    const updatedBasket = this.basketSubject.value.filter(item => item.productId !== id);
    this.updateBasketA(updatedBasket);
  }

  updateItemQuantity(id: number, quantity: number): void {
    const currentBasket = this.basketSubject.value.map(item =>
      item.productId === id ? { ...item, quantity } : item
    );

    this.updateBasket(currentBasket);
  }

  clearBasket(): void {
    this.updateBasketA([]);
  }

  private updateBasket(newBasket: BasketItem[]): void {
    this.basketSubject.next(newBasket);
    this.saveBasketToStorage(newBasket);
  }

  public updateBasketA(items: any): void {
    this.basketSubject.next(items);
    this.saveBasketToStorage(items);
  }
}
