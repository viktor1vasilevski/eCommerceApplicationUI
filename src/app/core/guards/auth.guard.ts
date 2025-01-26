import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationManagerService } from '../../shared/services/authentication-manager.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  debugger
  const authService = inject(AuthenticationManagerService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getRole();

  debugger

  if(isLoggedIn) {
    return true;
  }

  if (route.url[0].path === 'login' || route.url[0].path === 'register') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;

};
