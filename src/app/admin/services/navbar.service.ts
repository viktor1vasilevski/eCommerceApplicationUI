import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  isNavbarUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  updateNavbarTree(): void {
    this.isNavbarUpdated$.next(true);
  }
}
