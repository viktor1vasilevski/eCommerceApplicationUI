import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private _toastr: ToastrService) {}

  success(message: string | null, title: string = 'Success', options: any = {}) {
    if(message !== null) {
      this._toastr.success(message, title, {
        timeOut: 4500,
        positionClass: 'toast-bottom-right',
        ...options
      });
    }

  }

  info(message: string | null, title: string = 'Info', options: any = {}) {
    if(message !== null) {
      this._toastr.info(message, title, {
        timeOut: 4500,
        positionClass: 'toast-bottom-right',
        ...options
      });
    }
  }

  warning(message: string, title: string = 'Warning', options: any = {}) {
    this._toastr.warning(message, title, {
      timeOut: 4500,
      positionClass: 'toast-bottom-right',
      ...options
    });
  }

  error(message: string, title: string = 'Error', options: any = {}) {
    this._toastr.error(message, title, {
      timeOut: 4500,
      positionClass: 'toast-bottom-right',
      ...options
    });
  }
}

