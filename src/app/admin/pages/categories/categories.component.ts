import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryRequest } from '../../../shared/models/category/category-request';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse } from '../../../core/models/responses/api-response';
import { CategoryDTO } from '../../models/category/category-dto';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { NonGenericApiResponse } from '../../../core/models/responses/non-generic-api-response';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PaginationComponent, RouterOutlet, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  categories: any[] = [];
  categoryToDelete: any = null;
  isEditOrCreateMode: boolean = false;
  isLoading: boolean = true;

  @ViewChild('categoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  categoryRequest: CategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: ''
  };

  constructor(
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private router: Router
  ) {
    this._categoryService.categoryAddedOrEdited$.subscribe(status => {
      if(status){
        this.loadCategories();
      }
    })
  }

  onFilterChange(): void {
    this.nameChangeSubject.next(this.categoryRequest.name);
  }

  ngOnInit(): void {
    this.checkRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });

    this.isLoading = true;
    this.loadCategories();
    this.isLoading = false;

    this.nameChangeSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.categoryRequest.skip = 0;
        this.loadCategories();
      });
  }

  checkRoute(): void {
    const currentUrl = this.router.url;
    currentUrl.includes('/admin/categories/edit') || currentUrl.includes('/admin/categories/create') ?
    this.isEditOrCreateMode = true : 
    this.isEditOrCreateMode = false;
  }

  loadCategories() {
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (response: ApiResponse<CategoryDTO[]>) => {
        if (response && response.success && response.data) {
          this.categories = response.data;
          this.totalCount = typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
        } else {
          this._notificationService.error(response.message || "");
        }
      },
      error: (errorResponse: ApiResponse<CategoryDTO[]>) => {
        debugger
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.categoryRequest.take = itemsPerPage;
    this.categoryRequest.skip = 0;``
    this.currentPage = 1;
    this.loadCategories();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.categoryRequest.skip = (page - 1) * this.categoryRequest.take;
    this.loadCategories();
  }

  toggleSortOrder(column: string): void {
    if (this.categoryRequest.sortBy === column) {
      // Toggle the sort direction if the same column is clicked
      this.categoryRequest.sortDirection = this.categoryRequest.sortDirection === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    } else {
      // Set the new column for sorting and default to ascending
      this.categoryRequest.sortBy = column;
      this.categoryRequest.sortDirection = SortOrder.Ascending;
    }
  
    // Call the function to load the sorted categories from the API or backend
    this.loadCategories();
  }
  

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.categoryRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  prepareForDelete(category: any): void {
    this.categoryToDelete = category;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  deleteCategory(): void {
    if (this.categoryToDelete) {
      this._categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: (response: NonGenericApiResponse) => {
          if (response && response.success) {
            this._notificationService.success(response.message);
            this.closeModal();
            this.loadCategories();
          } else {
            this.closeModal();
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: NonGenericApiResponse) => {+
          this.closeModal();
          this._errorHandlerService.handleErrors(errorResponse);
        }
      });
    }
  }

  closeModal(): void {
    const deleteModalElement = document.getElementById('deleteConfirmationModal');
    if (deleteModalElement) {
      const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    this.categoryToDelete = null;
  }

  loadCreateCategoryPage() {
    this.isEditOrCreateMode = true;
    this.router.navigate(['/admin/categories/create'])
    
  }

  loadEditCategoryPage(categoryId: string) {
    this.isEditOrCreateMode = true;
    this.router.navigate([`/admin/categories/edit/${categoryId}`]);
  }

  onDeactivate() {
    this.isEditOrCreateMode = false;
  }


  ngOnDestroy(): void {
    this.nameChangeSubject.complete();
  }
}