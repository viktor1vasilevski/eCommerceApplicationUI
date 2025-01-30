import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryRequest } from '../../../shared/models/category/category-request';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse } from '../../../core/models/responses/api-response';
import { CreateCategoryDTO } from '../../models/category/create-category-dto';
import { EditCategoryDTO } from '../../models/category/edit-category-dto';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  isEditMode: boolean = false;
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage = 1;

  categories: any;;
  selectedCategory: any;
  @ViewChild('categoryNameInput') categoryNameInput!: ElementRef;

  createEditCategoryForm: FormGroup;

  private nameChangeSubject = new Subject<string>();

  categoryRequest: CategoryRequest = {
    skip: 0,
    take: 10,
    sort: SortOrder.Descending,
    name: ''
  };

  constructor(private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {
    this.createEditCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
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

  onItemsPerPageChange(event: Event): void {
    debugger
    const selectElement = event.target as HTMLSelectElement;
    const parsedValue = Number(selectElement.value);
    if (!isNaN(parsedValue)) {
      this.categoryRequest.take = parsedValue;
      this.categoryRequest.skip = 0;
      this.currentPage = 1;
      this.loadCategories();
    }
  }

  loadCategories() {
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (response: any) => {
        if(response) {
          this.categories = response.data;
        }
        this.totalCount = typeof response?.totalCount === 'number' ? response.totalCount : 0;
        this.calculateTotalPages();
        
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });

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

  onCreateEditCategory() {
    if (!this.createEditCategoryForm.valid) {
      this._notificationService.info("Invalid form");
      return;
    }
    
    const createEditCategoryForm = this.createEditCategoryForm.value;

    this.isEditMode ? this.editCategory(createEditCategoryForm) : this.createCategory(createEditCategoryForm);

  }

  editCategory(form: any) {
    this._categoryService.editCategory(this.selectedCategory.id, form).subscribe({
      next:(response: ApiResponse<EditCategoryDTO>) => {
        if (response && response.success) {
          this.loadCategories();
          this._notificationService.success(response.message);
          this.createEditCategoryForm.reset();
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: ApiResponse<EditCategoryDTO>) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  createCategory(form: any) {
    this._categoryService.createCategory(form).subscribe({
      next: (response: ApiResponse<CreateCategoryDTO>) => {
        if (response && response.success) {
          this.loadCategories();
          this._notificationService.success(response.message);
          this.createEditCategoryForm.reset();
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: ApiResponse<CreateCategoryDTO>) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }

  prepareForEdit(category: any): void {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.createEditCategoryForm.patchValue({
      name: category.name
    });
    setTimeout(() => this.categoryNameInput?.nativeElement.focus(), 0);
  }


  deleteCategory(cat: any) {

  }

  cancelEdit() {
    this.isEditMode = false;
    this.createEditCategoryForm.reset();
  }

  ngOnDestroy(): void {
    this.nameChangeSubject.complete();
  }

}
