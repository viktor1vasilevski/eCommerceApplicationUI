import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product/product-request';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy  {

  
  categoryId: string | null = null;
  subcategoryId: string | null = null;
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
    private _productService: ProductService
  ) {}



  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    debugger
    // Get the query parameters from the URL
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.subcategoryId = params['subcategoryId'];

      this._productService.getProducts(this.productRequest).subscribe({
        next: (response: any) => {
          console.log(response);
          
        },
        error: (errorResponse: any) => {
  
        }
      })
    });




  }
}
