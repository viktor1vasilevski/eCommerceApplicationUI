import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryRequest } from '../../../shared/models/category/category-request';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  category: any;

  private nameChangeSubject = new Subject<string>();

  categoryRequest: CategoryRequest = {
    skip: 0,
    take: 10,
    sort: 'desc',
    name: ''
  };

  constructor(private _categoryService: CategoryService) {

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

      }
    });

  }

  changePage(page: number): void {
    this.currentPage = page;
    this.categoryRequest.skip = (page - 1) * this.categoryRequest.take;
    this.loadCategories();
  }


  toggleSortOrder() {
    this.categoryRequest.sort = this.categoryRequest.sort === 'asc' ? 'desc' : 'asc';
    this.loadCategories();
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.categoryRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  onSubmit() {

  }

  editCategory(cat: any) {

  }

  deleteCategory(cat: any) {

  }

  cancelEdit() {

  }

  ngOnDestroy(): void {
    this.nameChangeSubject.complete();
  }

}
