import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { ApiResponse } from '../../../../core/models/responses/api-response';
import { EditCategoryDTO } from '../../../models/category/edit-category-dto';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit {

  editCategoryForm: FormGroup;
  selectedCategoryId: string = '';

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
  ) {
    this.editCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedCategoryId = params['id'];  
      this._categoryService.getCategoryById(this.selectedCategoryId).subscribe({
        next: (response: ApiResponse<EditCategoryDTO>) => {
          if(response && response.success) {
            this.editCategoryForm.patchValue({
              name: response.data?.name
            })
            
            //this._notificationService.success(response.message);
            //this._categoryService.notifyCategoryEdited();
            //this.router.navigate(['/admin/categories'])
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: ApiResponse<EditCategoryDTO>) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })


      //this.categoryId = params['id']; // Get the category ID from the route
      // Now you can use this.categoryId to fetch data for editing
      //console.log('Editing category with ID:', this.categoryId);
    });
  }

  onSubmit() {
    if(!this.editCategoryForm.valid){
      this._notificationService.info("Invalid form");
      return;
    }

    const editCategooryForm = this.editCategoryForm.value;

    this._categoryService.editCategory(this.selectedCategoryId, editCategooryForm).subscribe({
      next:(response: any) => {
        if(response && response.success) {
          this._categoryService.notifyCategoryAddedOrEdited();
          this._notificationService.success(response.message);
          this.router.navigate(['/admin/categories']);
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }

  cancelEdit() {
    this.router.navigate(['/admin/categories']);
  }


}
