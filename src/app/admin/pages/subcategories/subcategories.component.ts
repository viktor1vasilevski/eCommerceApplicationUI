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
import { SelectCategoryListItemDTO } from '../../models/category/select-category-list-item-dto';
import { ApiResponse } from '../../../core/models/responses/api-response';
import { NonGenericApiResponse } from '../../../core/models/responses/non-generic-api-response';
import { NavbarService } from '../../services/navbar.service';
declare var bootstrap: any;

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
  subcategoryToDelete: any;

  categories: any[] = [];
  categoryDropdown: SelectCategoryListItemDTO[] | null = [];

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  subcategoryRequest: SubcategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
    categoryId: ''
  };

  constructor(private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    private router: Router,
    private _navbarService: NavbarService
  ) {
    this._subcategoryService.subcategoryAdded$.subscribe(status => {
      if(status){
        this.loadSubcategories();
      }
    })

    this._subcategoryService.subcategoryEdited$.subscribe(status => {
      if(status){
        this.loadSubcategories();
      }
    })
  }

  ngOnInit(): void {
    this.checkRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  
    this.loadCategoriesDropdownList();
    this.loadSubcategories();
  
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
      next: (response: ApiResponse<SelectCategoryListItemDTO[]>) => {
        if(response && response.success){
          this.categoryDropdown = response.data;
        } else {
          this._notificationService.info(response.message)
        }
      },
      error: (errorResponse: ApiResponse<SelectCategoryListItemDTO[]>) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  checkRoute(): void {
    const currentUrl = this.router.url;
    currentUrl.includes('/admin/subcategories/edit') || currentUrl.includes('/admin/subcategories/create') ?
    this.isEditOrCreateMode = true : 
    this.isEditOrCreateMode = false;
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.subcategoryRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  loadCreateSubcategoryPage() {
    this.isEditOrCreateMode = true;
    this.router.navigate(['/admin/subcategories/create'])
  }

  toggleSortOrder(column: string): void {

    if (this.subcategoryRequest.sortBy === column) {
      // Toggle the sort direction if the same column is clicked
      this.subcategoryRequest.sortDirection = this.subcategoryRequest.sortDirection === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending;
    } else {
      // Set the new column for sorting and default to ascending
      this.subcategoryRequest.sortBy = column;
      this.subcategoryRequest.sortDirection = SortOrder.Ascending;
    }
  
    // Call the function to load the sorted categories from the API or backend
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
    this.isEditOrCreateMode = true;
    this.router.navigate([`/admin/subcategories/edit/${id}`]);
  }

  prepareForDelete(subcategory: any) {
    this.subcategoryToDelete = subcategory;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  deleteSubcategory() {
    if (this.subcategoryToDelete) {
      this._subcategoryService.deleteSubcategory(this.subcategoryToDelete.id).subscribe({
        next: (response: NonGenericApiResponse) => {
          if (response && response.success) {
            this._notificationService.success(response.message);
            this.closeModal();
            this.loadSubcategories();
            this._navbarService.updateNavbarTree();
          } else {
            this._notificationService.info(response.message);
            this.closeModal();
          }
        },
        error: (errorResponse: NonGenericApiResponse) => {
          this._errorHandlerService.handleErrors(errorResponse);
          this.closeModal();
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

  onDeactivate() {
    this.isEditOrCreateMode = false;
  }


  ngOnDestroy(): void {
    this.nameChangeSubject.complete();
  }

}
