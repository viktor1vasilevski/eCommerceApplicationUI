import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface BasketItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketKey = 'basket';
  private basketSubject: BehaviorSubject<BasketItem[]> = new BehaviorSubject<BasketItem[]>(this.loadBasketFromStorage());

  basket$: Observable<BasketItem[]> = this.basketSubject.asObservable(); // Public observable

  constructor() {}

  private loadBasketFromStorage(): BasketItem[] {
    const savedBasket = localStorage.getItem(this.basketKey);
    return savedBasket ? JSON.parse(savedBasket) : [];
  }

  private saveBasketToStorage(basket: BasketItem[]): void {
    localStorage.setItem(this.basketKey, JSON.stringify(basket));
  }

  addItem(productId: number, quantity: number = 1): void {
    const currentBasket = this.basketSubject.value;
    const existingItem = currentBasket.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentBasket.push({ productId, quantity });
    }

    this.updateBasket(currentBasket);
  }

  removeItem(id: number): void {
    const updatedBasket = this.basketSubject.value.filter(item => item.productId !== id);
    this.updateBasket(updatedBasket);
  }

  updateItemQuantity(id: number, quantity: number): void {
    const currentBasket = this.basketSubject.value.map(item =>
      item.productId === id ? { ...item, quantity } : item
    );

    this.updateBasket(currentBasket);
  }

  clearBasket(): void {
    this.updateBasket([]);
  }

  private updateBasket(newBasket: BasketItem[]): void {
    this.basketSubject.next(newBasket);
    this.saveBasketToStorage(newBasket);
  }
}
