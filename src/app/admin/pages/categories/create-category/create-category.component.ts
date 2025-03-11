import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { ApiResponse } from '../../../../core/models/responses/api-response';
import { CreateCategoryDTO } from '../../../models/category/create-category-dto';
import { NavbarService } from '../../../services/navbar.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css'
})
export class CreateCategoryComponent {

  createCategoryForm: FormGroup;

  constructor(private fb: FormBuilder,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router,
    private _categoryService: CategoryService,
    private _navbarService: NavbarService
  ) {
    this.createCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if(this.createCategoryForm.valid) {
      const createCategoryForm = this.createCategoryForm.value;
      this._categoryService.createCategory(createCategoryForm).subscribe({
        next:(response: ApiResponse<CreateCategoryDTO>) => {
          if(response && response.success) {
            this._notificationService.success(response.message);
            this._categoryService.notifyCategoryAddedOrEdited();
            this._navbarService.updateNavbarTree();
            this.router.navigate(['/admin/categories']);
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: ApiResponse<CreateCategoryDTO>) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })
    } else {
      this._notificationService.info("Invalid form");
    }
  }

}
