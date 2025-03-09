import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product/product-request';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categoryId: string | null = null;
  subcategoryId: string | null = null;

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

  constructor(private activatedRoute: ActivatedRoute,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    // Get the query parameters from the URL
    this.activatedRoute.queryParams.subscribe(params => {
      this.productRequest.categoryId = params['categoryId'];
      this.productRequest.subcategoryId = params['subcategoryId'];
    });

    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        console.log(response);
        
      },
      error: (errorResponse: any) => {

      }
    })


  }
}
