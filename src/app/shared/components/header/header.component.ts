import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthManagerService } from '../../services/auth-manager.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category/category-request';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NavbarService } from '../../../admin/services/navbar.service';
import { BasketService } from '../../../customer/services/basket.service';

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
  basketItemCount: number = 0;
  basketItems: any[] = [];

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
    private _errorHandlerService: ErrorHandlerService,
    private _basketService: BasketService
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

    this._basketService.basket$.subscribe(items => { console.log(items);
     this.basketItems = items})

  
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
      error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
    });
  }
  
  getTotal(): number {
    return this.basketItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }


  onLogout() : void {
    this._authManagerService.logout();
    this._basketService.clearBasket();
    this.router.navigate(['/home']);
  }

  removeFromBasket(item: any) {
   
    if(this._authManagerService.isLoggedIn()) {
      this._basketService.removeBasketItemsForUser(this._authManagerService.getUserId(), item.id).subscribe({
        next: (response: any) => {
          if(response && response.success && response.data) {
            this._basketService.updateBasketA(response.data);
            this._notificationService.success(response.message);
          } else {
            this._notificationService.error(response.message);
          }
          
        },
        error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
      })
    } else {
      this._basketService.removeItem(item.productId)
    }
   
  }

}
