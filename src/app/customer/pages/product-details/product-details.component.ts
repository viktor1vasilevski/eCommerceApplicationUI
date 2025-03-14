import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: any;
  quantity: number = 1;

  constructor(private location: Location,
    private _basketService: BasketService
  ) {

  }


  ngOnInit(): void {
    debugger
    const state = this.location.getState() as any;
    this.product = state.product; // Getting product from route state
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQuantity() {
    this.quantity++;
  }

  addToBasket() {
    this._basketService.updateLocalBasketCount(this.product, this.quantity);
    
  }

}
