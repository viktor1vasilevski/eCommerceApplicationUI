import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-edit-subcategory',
  standalone: true,
  imports: [],
  templateUrl: './edit-subcategory.component.html',
  styleUrl: './edit-subcategory.component.css'
})
export class EditSubcategoryComponent implements OnInit {


  editSubcategoryForm: FormGroup;
  selectedSubcategoryId: string = '';

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
  ) {
    this.editSubcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedSubcategoryId = params['id'];  
      this._categoryService.getCategoryById(this.selectedSubcategoryId).subscribe({
        next: (response: any) => {
          if(response && response.success) {
            this.editSubcategoryForm.patchValue({
              name: response.data?.name
            })
            
            //this._notificationService.success(response.message);
            //this._categoryService.notifyCategoryEdited();
            //this.router.navigate(['/admin/categories'])
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      })
    });
  }

}
