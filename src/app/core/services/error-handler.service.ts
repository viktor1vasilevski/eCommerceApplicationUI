import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {

  constructor(private _notificationService: NotificationService) {}

  handleErrors(errorResponse: any) {
    if (errorResponse?.error?.errors) {
      // Handle validation errors
      const errors = errorResponse.error.errors;
      const allErrors: string[] = [];

      for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
          errors[field].forEach((message: string) => {
            this._notificationService.info(message, field, { timeOut: 4500, positionClass: 'toast-bottom-right' })
          });
        }
      }

    } else if (errorResponse?.error?.message) {
      // Handle general error messages
      this._notificationService.info(errorResponse.error.message);
    } else {
      // Fallback for unexpected errors
      this._notificationService.error('An unexpected error occurred.');
    }
  }
}
