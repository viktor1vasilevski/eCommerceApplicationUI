import { Routes } from '@angular/router';

export const customerRoutes: Routes = [

  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
];
