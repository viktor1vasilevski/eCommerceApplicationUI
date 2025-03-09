import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthManagerService } from '../../services/auth-manager.service';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category/category-request';
import { SortOrder } from '../../../core/enums/sort-order.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  role: string | null = "";
  isLogged: boolean = false;
  username: string | null = '';
  email: string | null = "";
  categories: any[] = [];

  catId: string = "";
  categoryRequest: CategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: 'soap'
  };

  constructor(private _authManagerService: AuthManagerService,
    private router: Router,
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService
  ) {
    this._authManagerService.role$.subscribe(role => {
      this.role = role;
    }),
    this._authManagerService.email$.subscribe(mail => {
      this.email = mail;
    }),

    this._authManagerService.username$.subscribe(username => {
      this.username = username;
    }),


    this._authManagerService.loggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
  }


  ngOnInit(): void {
    this._categoryService.getCategoriesWithSubcategories().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.categories = response.data;
  
          // Add the isSubmenuVisible flag to each category

        }
      },
      error: (errorResponse: any) => {
        // Handle error response if needed
      }
    });
  }
  


  onLogout() : void {
    this._authManagerService.logout();
    this.router.navigate(['/home']);
  }

}
