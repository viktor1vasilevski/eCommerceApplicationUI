import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {

  createProductForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {

  }

}
