import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ProductService } from '../../../shared/services/product.service';
import { ProductRequest } from '../../../shared/models/product/product-request';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { CategoryService } from '../../../shared/services/category.service';
import { SubcategoryService } from '../../../shared/services/subcategory.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  subcategories: any;
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  subcategoryToDelete: any;
  categoriesDrowdown: any[] = [];
  subcategoriesDrowdown: any[] = [];

  private nameChangeSubject = new Subject<string>();
  private brandChangeSubject = new Subject<string>();
  private descChangeSubject = new Subject<string>();
  private scentChangeSubject = new Subject<string>();
  private editionChangeSubject = new Subject<string>();

  filters = {
    name: '',
    brand: '',
    category: ''
};

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

  constructor(private router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
  ) {
    this._productService.productAddedOrEdited$.subscribe(status => {
      if(status){
        this.productRequest.sortDirection = 'desc';
        this.productRequest.sortBy = 'created';
        this.loadProducts();
      }
    })
  }


  ngOnInit(): void {
    this.loadProducts();
    this.loadCategoriesDropdownList();
    this.loadSubcategoriesDropdownList();

    this.nameChangeSubject.pipe(debounceTime(400),distinctUntilChanged()).subscribe(() => {
      this.productRequest.skip = 0;
      this.loadProducts();
    });

    this.brandChangeSubject.pipe(debounceTime(400),distinctUntilChanged()).subscribe(() => {
      this.productRequest.skip = 0;
      this.loadProducts();
    });

    this.descChangeSubject.pipe(debounceTime(400),distinctUntilChanged()).subscribe(() => {
      this.productRequest.skip = 0;
      this.loadProducts();
    });

    this.scentChangeSubject.pipe(debounceTime(400),distinctUntilChanged()).subscribe(() => {
      this.productRequest.skip = 0;
      this.loadProducts();
    });

    this.editionChangeSubject.pipe(debounceTime(400),distinctUntilChanged()).subscribe(() => {
      this.productRequest.skip = 0;
      this.loadProducts();
    });
  }

  loadProducts() {
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        if(response && response.success) {
          this.products = response.data;
          this.totalCount = typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
          
        }
        
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
        
      }
    })
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success && response.data) {
          this.categoriesDrowdown = response.data;
        }
      },
      error: (errorResponse: any) => {

      }
    })
  }

  loadSubcategoriesDropdownList() {
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success && response.data) {
          this.subcategoriesDrowdown = response.data;
        }
      },
      error: (errorResponse: any) => {

      }
    })
  }

  loadCreateProductPage() {
    this.isEditOrCreateMode = true;
    this.router.navigate(['/admin/products/create'])
  }
  
  toggleSortOrder(sortedBy: string) {
    this.productRequest.sortDirection = this.productRequest.sortDirection === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    this.productRequest.sortBy = sortedBy;
    this.loadProducts();
  }

  onDropdownItemChange(event: any, type: string) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    type == 'category' ? 
    this.productRequest.categoryId = selectedValue : 
    this.productRequest.subcategoryId = selectedValue;

    this.productRequest.skip = 0;
    this.loadProducts();
  }

  onSubcategoryChange(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.productRequest.subcategoryId = selectedValue;
    this.productRequest.skip = 0;
    this.loadProducts();
  }

  onNameChange(): void {
    this.nameChangeSubject.next(this.productRequest.name);
  }

  onFilterChange(type: string) : void {
    switch (type) {
      case 'name':
        this.nameChangeSubject.next(this.productRequest.name);
        break;
      case 'brand':
          this.brandChangeSubject.next(this.productRequest.brand);
        break;
      case 'desc':
          this.descChangeSubject.next(this.productRequest.description);
        break;
      case 'scent':
          this.scentChangeSubject.next(this.productRequest.scent);
        break;
      case 'edition':
          this.editionChangeSubject.next(this.productRequest.edition);
        break;
      default:
        break;
    }
  }

  onProductChange(event: any) {

  }

  loadEditProductPage(id: any) {

  }

  prepareForDelete(el: any) {

  }

  changePage(page: any) {
    this.currentPage = page;
    this.productRequest.skip = (page - 1) * this.productRequest.take;
    this.loadProducts();
  }

  onItemsPerPageChange(itemsPerPage: any) {
    this.productRequest.take = itemsPerPage;
    this.productRequest.skip = 0;
    this.currentPage = 1;
    this.loadProducts();
  }



  onDeactivate() {
    this.isEditOrCreateMode = false;
  }

  deleteProduct() {

  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.productRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }


  applyFilters(event: Event, sortBy: string) {
    debugger
    const selectElement = event.target as HTMLSelectElement;
    const sortDirection = selectElement.value;
  
    if (sortDirection) {
      this.productRequest.sortBy = sortBy;
      this.productRequest.sortDirection = sortDirection;
      this.loadProducts();
    }
  }
  
  
}
