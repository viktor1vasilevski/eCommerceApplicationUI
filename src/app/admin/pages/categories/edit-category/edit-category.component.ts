import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit {

  //categoryId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      //this.categoryId = params['id']; // Get the category ID from the route
      // Now you can use this.categoryId to fetch data for editing
      //console.log('Editing category with ID:', this.categoryId);
    });
  }
}
