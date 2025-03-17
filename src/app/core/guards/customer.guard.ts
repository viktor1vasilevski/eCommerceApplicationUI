import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthManagerService } from '../../shared/services/auth-manager.service';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../customer/services/basket.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthManagerService);
  const basketService = inject(BasketService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  debugger
  const user = authService.getRole();
  const id = authService.getUserId();

  basketService.getBasketItemsByUserId(id).subscribe({
    next: (response: any) => {
      if(response && response.success && response.data) {
        basketService.basketCountSubject.next(response.data);
      }
    },
    error: (errorResponse: any) => {

    }
  });

  if (!user || user === 'Customer') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
