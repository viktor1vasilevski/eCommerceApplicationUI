import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { SubcategoryService } from '../../../../shared/services/subcategory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-subcategory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-subcategory.component.html',
  styleUrl: './edit-subcategory.component.css'
})
export class EditSubcategoryComponent implements OnInit {


  editSubcategoryForm: FormGroup;
  selectedSubcategoryId: string = '';
  categoryDropdown: any;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {

    this.route.params.subscribe(params => {
      this.selectedSubcategoryId = params['id'];  
    });

    this.editSubcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.loadSubcategoryById();
    this.loadCategoriesDropdownList();
  }

  loadSubcategoryById() {
    this._subcategoryService.getSubcategoryById(this.selectedSubcategoryId).subscribe({
      next: (response: any) => {
        if(response && response.success) {
          this.editSubcategoryForm.patchValue({
            name: response.data?.name,
            categoryId: response.data?.categoryId 
          })
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

  onSubmit() {
    if(!this.editSubcategoryForm.valid){
      this._notificationService.info("Invalid form");
      return;
    }

    const editSubcategoryForm = this.editSubcategoryForm.value;

    this._subcategoryService.editSubcategory(this.selectedSubcategoryId, editSubcategoryForm).subscribe({
      next:(response: any) => {
        if(response && response.success) {
          this._subcategoryService.notifySubcategoryEdited();
          this._notificationService.success(response.message);
          this.router.navigate(['/admin/subcategories']);
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    })
  }


}
