import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { SubcategoryService } from '../../../../shared/services/subcategory.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {

  createProductForm!: FormGroup;
  imagePreviewUrl: string | null = null;
  categoryDropdown: any[] = [];

  constructor(private fb: FormBuilder,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      unitPrice: [null, [Validators.required, Validators.min(0.01)]],
      unitQuantity: [null, [Validators.required, Validators.min(1)]],
      volume: [null, [Validators.required, Validators.min(1)]],
      scent: [''],
      edition: [''],
      image: [ '' , [Validators.required]],
      subcategoryId: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.loadCategoriesDropdownList();
  }

  loadCategoriesDropdownList() {
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
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


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreviewUrl = base64String;
        this.createProductForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file); 
    }
  }

  onSubmit() {

  }

}
