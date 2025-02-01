import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit {

  editCategoryForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      //this.categoryId = params['id']; // Get the category ID from the route
      // Now you can use this.categoryId to fetch data for editing
      //console.log('Editing category with ID:', this.categoryId);
    });
  }

  onSubmit() {

  }

  cancelEdit() {
    this.router.navigate(['/admin/categories']);
  }


}
