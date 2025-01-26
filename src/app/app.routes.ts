import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/pages/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.adminRoutes), canActivate: [authGuard]
    },
    {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer.routes').then((m) => m.customerRoutes), canActivate: [authGuard]
    },
    {
      path: 'unauthorized',
      component: UnauthorizedComponent
    },
];
