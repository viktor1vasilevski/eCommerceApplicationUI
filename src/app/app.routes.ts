import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/pages/unauthorized/unauthorized.component';

export const routes: Routes = [

  { 
    path: 'login', 
    loadComponent: () => import('./shared/pages/login/login.component')
        .then((m) => m.LoginComponent),
    canActivate: [ authGuard ]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./shared/pages/register/register.component')
        .then((m) => m.RegisterComponent),
    canActivate: [ authGuard ]
  },
  { 
    path: 'home', 
    loadComponent: () => import('./shared/pages/home/home.component')
        .then((m) => m.HomeComponent),
  },




  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes), 
    canActivate: [authGuard], 
    data: { roles: ['Admin'] }
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.routes').then((m) => m.customerRoutes), 
    canActivate: [authGuard],
    data: { roles: ['Customer'] }
  },





  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
];
