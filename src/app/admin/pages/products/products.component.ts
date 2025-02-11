import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { PaginationComponent } from "../../components/pagination/pagination.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, 
    PaginationComponent, RouterOutlet, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  isEditOrCreateMode: boolean = false;
  products: any[] = [];
  productRequest: any;
  categoryDropdown: any;
  subcategories: any;
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  subcategoryToDelete: any;

  constructor(private router: Router) {}

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

  }

  deleteProduct() {

  }
}
