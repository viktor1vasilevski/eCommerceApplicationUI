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
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/subcategories/create-subcategory/create-subcategory.component')
          .then((m) => m.CreateSubcategoryComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/subcategories/edit-subcategory/edit-subcategory.component')
          .then((m) => m.EditSubcategoryComponent)
      },
    ]
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then((m) => m.ProductsComponent),
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/products/create-product/create-product.component')
          .then((m) => m.CreateProductComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/products/edit-product/edit-product.component')
          .then((m) => m.EditProductComponent)
      },
    ]
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
  }
];
