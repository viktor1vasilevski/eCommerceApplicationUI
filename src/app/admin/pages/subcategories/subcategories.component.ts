import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SubcategoryRequest } from '../../../shared/models/subcategory/subcategory-request';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { CategoryService } from '../../../shared/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SubcategoryService } from '../../../shared/services/subcategory.service';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [PaginationComponent, CommonModule, FormsModule, 
    ReactiveFormsModule, RouterOutlet],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css'
})
export class SubcategoriesComponent implements OnInit {

  isEditOrCreateMode: boolean = false;
  subcategories: any[] = [];
  categoryToDelete: any;
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;

  categories: any;
  categoryDropdown: any[] = [];

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  subcategoryRequest: SubcategoryRequest = {
    skip: 0,
    take: 10,
    sort: SortOrder.Descending,
    name: '',
    categoryId: ''
  };

  constructor(private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.checkRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  
    this.loadSubcategories();
    this.loadCategoriesDropdownList();
  
    this.nameChangeSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.subcategoryRequest.skip = 0;
        this.loadSubcategories();
      });
  }

  loadSubcategories() {
    this._subcategoryService.getSubcategories(this.subcategoryRequest).subscribe({
      next: (response: any) => {
        if(response && response.success) {
          this.subcategories = response.data;
          this.totalCount = typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }



  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success){
          this.categoryDropdown = response.data;
        } else {
          this._notificationService.info(response.message)
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  checkRoute(): void {
    const currentUrl = this.router.url;
    // if (currentUrl.includes('/admin/categories/edit') || currentUrl.includes('/admin/categories/create')) {
    //   this.isEditOrCreateMode = true;
    // } else {
    //   this.isEditOrCreateMode = false;
    // }
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.subcategoryRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  loadCreateSubcategoryPage() {

  }

  toggleSortOrder() {
    this.subcategoryRequest.sort = this.subcategoryRequest.sort === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    this.loadSubcategories();
  }

  onNameChange(): void {
    this.nameChangeSubject.next(this.subcategoryRequest.name);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.subcategoryRequest.skip = (page - 1) * this.subcategoryRequest.take;
    this.loadSubcategories();
  }

  onCategoryChange(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.subcategoryRequest.categoryId = selectedValue;
    this.loadSubcategories()
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.subcategoryRequest.take = itemsPerPage;
    this.subcategoryRequest.skip = 0;
    this.currentPage = 1;
    this.loadSubcategories();
  }

  loadEditSubcategoryPage(id: any) {

  }

  prepareForDelete(el: any) {

  }

  deleteCategory() {

  }

  onDeactivate() {

  }

}
