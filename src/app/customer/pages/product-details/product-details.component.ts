import { Component } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  
  product: any;

  constructor(private router: Router, private basketService: BasketService) {
    // Retrieve product data from router state
    debugger
    const navigation = this.router.getCurrentNavigation();
    this.product = navigation?.extras.state?.['product'] || null;

    if (!this.product) {
      // Redirect or show an error if no product is found
      this.router.navigate(['/customer/products']);
    }
  }
}
