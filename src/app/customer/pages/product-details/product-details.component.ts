import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BasketService } from '../../services/basket.service';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';

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
    private _basketService: BasketService,
    private _authManagerService: AuthManagerService
  ) {

  }


  ngOnInit(): void {
    const state = this.location.getState() as any;
    this.product = state.product;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQuantity() {
    this.quantity++;
  }

  addToBasket() {
    let userId = this._authManagerService.getUserId();



    this._basketService.updateLocalBasketCount(this.product, this.quantity, userId);
    
  }

}
