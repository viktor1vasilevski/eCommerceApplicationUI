import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryRequest } from '../../../shared/models/category/category-request';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse } from '../../../core/models/responses/api-response';
import { CategoryDTO } from '../../models/category/category-dto';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { NonGenericApiResponse } from '../../../core/models/responses/non-generic-api-response';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
  categories: any;
  categoryToDelete: any = null;

  @ViewChild('categoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  categoryRequest: CategoryRequest = {
    skip: 0,
    take: 10,
    sort: SortOrder.Descending,
    name: ''
  };

  constructor(
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private router: Router
  ) {

  }

  onNameChange(): void {
    this.nameChangeSubject.next(this.categoryRequest.name);
  }

  ngOnInit(): void {
    this.loadCategories();

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

  loadCategories() {
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (response: ApiResponse<CategoryDTO[]>) => {
        if (response && response.success) {
          this.categories = response.data;
          this.totalCount = typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: ApiResponse<CategoryDTO[]>) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.categoryRequest.take = itemsPerPage;
    this.categoryRequest.skip = 0;
    this.currentPage = 1;
    this.loadCategories();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.categoryRequest.skip = (page - 1) * this.categoryRequest.take;
    this.loadCategories();
  }

  toggleSortOrder() {
    this.categoryRequest.sort = this.categoryRequest.sort === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
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
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: NonGenericApiResponse) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      });
    }
  }

  closeModal(): void {
    debugger
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
    this.router.navigate(['/admin/categories/create'])
    
  }

  loadEditCategoryPage(categoryId: string) {
    this.router.navigate([`/admin/categories/edit/${categoryId}`]);
  }


  ngOnDestroy(): void {
    this.nameChangeSubject.complete();
  }
}