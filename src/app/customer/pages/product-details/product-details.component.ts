import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(private location: Location) {
    debugger

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

  addToCart() {
    console.log(`Adding ${this.quantity} of ${this.product.name} to cart`);
  }

}
