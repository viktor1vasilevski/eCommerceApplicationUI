import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { SubcategoryService } from '../../../../shared/services/subcategory.service';
import { ProductService } from '../../../../shared/services/product.service';

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
    private _productService: ProductService,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router,
  ) {
    this.createProductForm = this.fb.group({
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
    // if(!this.createProductForm.valid) {
    //   this._notificationService.info("Invalid form");
    //   return;
    // }

    const createProductForm = this.createProductForm.value;
    this._productService.createProduct(createProductForm).subscribe({
      next: (response: any) => {
        this._notificationService.success(response.message);
        this._productService.notifyProductAddedOrEdited();
        this.router.navigate(['/admin/products']);
        
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      }
    });
  }

}
