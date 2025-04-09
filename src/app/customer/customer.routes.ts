import { Routes } from '@angular/router';

export const customerRoutes: Routes = [

  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'product-details',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent),
  },
  {
    path: 'basket-items',
    loadComponent: () =>
      import('./pages/basket-items/basket-items.component').then((m) => m.BasketItemsComponent),
  },
];
