import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { SubcategoryRequest } from '../../../shared/models/subcategory/subcategory-request';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { CategoryService } from '../../../shared/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';

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

  subcategoryRequest: SubcategoryRequest = {
    skip: 0,
    take: 10,
    sort: SortOrder.Descending,
    name: '',
    categoryId: ''
  };

  constructor(private _categoryService: CategoryService,
      private _errorHandlerService: ErrorHandlerService,
      private _notificationService: NotificationService,
      private router: Router
  ) {

  }


  ngOnInit(): void {
    this.loadCategoriesDropdownList();
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success){
          this.categoryDropdown = response.data;
        }
        
      },
      error: (errorResponse: any) => {

      }
    })
  }

  loadCreateSubcategoryPage() {

  }

  toggleSortOrder() {

  }

  onNameChange() {

  }

  changePage(event: any) {

  }

  onCategoryChange(event: any) {

  }

  onItemsPerPageChange(event: any) {

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
