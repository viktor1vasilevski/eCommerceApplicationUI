import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product/product-request';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';

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
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {}



  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      debugger
      // this.productRequest.categoryId = params['categoryId'];
      // this.productRequest.subcategoryId = params['subcategoryId'];
      this.loadProducts(this.productRequest)
    });




  }


  loadProducts(request: any) {
      this._productService.getProducts(this.productRequest).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this.products = response.data;
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })
  }
}
