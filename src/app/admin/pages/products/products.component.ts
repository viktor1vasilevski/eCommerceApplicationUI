import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product/product-request';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule, PaginationComponent,
     RouterOutlet, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  isEditOrCreateMode: boolean = false;
  products: any[] = [];
  categoryDropdown: any;
  subcategories: any;
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  subcategoryToDelete: any;

  productRequest: ProductRequest = {
    name: '',
    brand: '',
    edition:'',
    scent:'',
    categoryId: '',
    subcategoryId: '',
    skip: 0,
    take: 10,
    sort: 'desc'
  };

  constructor(private router: Router,
    private _productService: ProductService
  ) {}


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        debugger
        if(response && response.success) {
          this.products = response.data;
          console.log(this.products);
          
        }
        
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
        
      }
    })
  }

  loadCreateProductPage() {
    this.isEditOrCreateMode = true;
    this.router.navigate(['/admin/products/create'])
  }
  
  toggleSortOrder() {

  }

  onNameChange(){

  }

  onProductChange(event: any) {

  }

  loadEditProductPage(id: any) {

  }

  prepareForDelete(el: any) {

  }

  changePage(e: any) {

  }

  onItemsPerPageChange(e: any) {

  }

  onDeactivate() {
    this.isEditOrCreateMode = false;
  }

  deleteProduct() {

  }
}
