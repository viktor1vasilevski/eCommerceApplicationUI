import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthManagerService } from '../../services/auth-manager.service';
import { CommonModule } from '@angular/common';
import { SubcategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category/category-request';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NavbarService } from '../../../admin/services/navbar.service';

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
    private _navbarService: NavbarService,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
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
    }),

    this._navbarService.isNavbarUpdated$.subscribe(status => {
      if(status) {
        this.loadCategoriesWithSubcategories();
      }
    })  
  }


  ngOnInit(): void {
    this.loadCategoriesWithSubcategories();

  }

  loadCategoriesWithSubcategories() {
    this._categoryService.getCategoriesWithSubcategories().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.categories = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      }
    });
  }
  


  onLogout() : void {
    this._authManagerService.logout();
    this.router.navigate(['/home']);
  }

}
