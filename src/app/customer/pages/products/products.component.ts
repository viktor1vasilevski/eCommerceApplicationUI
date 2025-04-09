import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product/product-request';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { BasketService } from '../../services/basket.service';
import { AuthManagerService } from '../../../shared/services/auth-manager.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy  {

  
  categoryId: string | null = null;
  subcategoryId: string | null = null;
  products: any[] = [];

  categorySlug: string = "";
  subcategorySlug: string = "";

  private routeSub: Subscription | undefined; 

  productRequest: ProductRequest = {
    name: '',
    brand: '',
    description: '',
    edition:'',
    scent:'',
    categoryId: '',
    subcategoryId: '',
    price: '',
    quantity: '',
    volume: '',
    skip: 0,
    take: 10,
    sortDirection: 'desc',
    sortBy: 'created'
  };

  constructor(private route: ActivatedRoute,
    private _productService: ProductService,
    private _basketService: BasketService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _authManagerService: AuthManagerService,
    private router: Router
  ) {}



  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.productRequest.categoryId = params['categoryId'];
      this.productRequest.subcategoryId = params['subcategoryId'];
      this.loadProducts(this.productRequest)
    });

  }

  viewDetails(product: any) {
    this.router.navigate(['customer/product-details'], { state: { product } });
  }
  


  loadProducts(request: any) {
      this._productService.getProducts(this.productRequest).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this.products = response.data;

            
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
      })
  }

  AddToBasket(item: any) {

    if(this._authManagerService.isLoggedIn()) {
      let userId = this._authManagerService.getUserId();
      this._basketService.addToBasket(userId, item.id).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this._basketService.updateBasketA(response.data)
            this._notificationService.success(response.message);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
      })
    }


  }
}
