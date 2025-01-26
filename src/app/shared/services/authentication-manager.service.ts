import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationManagerService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_ID = 'user_id';

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  private subjetRole = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.subjetRole.asObservable();

  constructor() { }

  setSession(token: string, role: string, userId: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.USER_ID, userId);
    this.loggedInSubject.next(true);
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_ID);
    this.loggedInSubject.next(false);
  }

  setLoggedInState(value: boolean, role: string): void {
    this.loggedInSubject.next(value);
    this.subjetRole.next(role);
  }
}
