import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../../../shared/services/subcategory.service';

@Component({
  selector: 'app-create-subcategory',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-subcategory.component.html',
  styleUrl: './create-subcategory.component.css'
})
export class CreateSubcategoryComponent implements OnInit {

  createSubcategoryForm: FormGroup;
  categoryDropdown: any[] = [];

  constructor(private fb: FormBuilder,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService
  ) {
    this.createSubcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadCategoriesDropdownList();
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

  onSubmit() {
    if(this.createSubcategoryForm.valid) {
      const createSubcategoryForm = this.createSubcategoryForm.value;
      this._subcategoryService.createSubcategory(createSubcategoryForm).subscribe({
        next:(response: any) => {
          if(response && response.success) {
            this._notificationService.success(response.message);
            this._subcategoryService.notifySubcategoryAdded();
            this.router.navigate(['/admin/subcategories']);
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })
    } else {
      this._notificationService.info("Invalid form");
    }
  }

}
