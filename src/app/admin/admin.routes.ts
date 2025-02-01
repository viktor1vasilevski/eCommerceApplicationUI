import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.component').then((m) => m.CategoriesComponent),
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/categories/create-category/create-category.component')
          .then((m) => m.CreateCategoryComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/categories/edit-category/edit-category.component')
          .then((m) => m.EditCategoryComponent)
      },
    ]
  },
  {
    path: 'subcategories',
    loadComponent: () =>
      import('./pages/subcategories/subcategories.component').then((m) => m.SubcategoriesComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
  }
];
