import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  isEditMode: boolean = false;
  categories: any[] = [];
  category: any;

  onSubmit() {

  }

  onEdit(cat: any) {

  }

  onDelete(cat: any) {

  }

  cancelEdit() {

  }

}
