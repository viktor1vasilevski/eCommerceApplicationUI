import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/pages/unauthorized/unauthorized.component';
import { customerGuard } from './core/guards/customer.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes), 
    canActivate: [authGuard], 
    data: { roles: ['Admin'] }
  },

  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.routes').then((m) => m.customerRoutes), 
    canActivate: [ customerGuard ]
  },
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
    canActivate: [ customerGuard ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
];
