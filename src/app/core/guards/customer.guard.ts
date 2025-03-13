import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthManagerService } from '../../shared/services/auth-manager.service';
import { ToastrService } from 'ngx-toastr';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthManagerService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const user = authService.getRole();

  if (!user || user === 'Customer') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
