import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../../../shared/services/subcategory.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {

  editProductForm!: FormGroup;
  selectedProductId: string = '';
  imagePreviewUrl: string | null = null;
  categoryDropdown: any[] = [];

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private _productService: ProductService,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.editProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      unitPrice: ['', [Validators.required, Validators.min(0.01)]],
      unitQuantity: ['', [Validators.required, Validators.min(1)]],
      volume: [null, [Validators.min(1)]],
      scent: [null, Validators.maxLength(100)],
      edition: ['', Validators.maxLength(100)],
      image: [ '' , [Validators.required]],
      subcategoryId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCategoriesDropdownList();
    this.route.params.subscribe(params => {
      this.selectedProductId = params['id'];
      console.log(this.selectedProductId);
      
    })
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


  onSubmit() {

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreviewUrl = base64String;
        this.editProductForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file); 
    }
  }

}
