import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USERNAME_KEY = 'user_name';
  private readonly EMAIL_KEY = 'user_email';
  private readonly USER_ID_KEY = 'user_id';

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  private subjetRole = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.subjetRole.asObservable();

  private subjectEmail = new BehaviorSubject<string | null>(this.getEmail());
  email$ = this.subjectEmail.asObservable();

  private username = new BehaviorSubject<string | null>(this.getUsername());
  username$ = this.username.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(this.getUserId());
  userId$ = this.userIdSubject.asObservable();

  private usernameForLogin = new BehaviorSubject<string>("");
  getUsernameForLogin$ = this.usernameForLogin.asObservable();

  constructor() { }

  setSession(email: string, token: string, role: string, username: string, id: string): void {
    if (!token || !role || !username) return;
  
    localStorage.setItem(this.USER_ID_KEY, id);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.EMAIL_KEY, email);
    this.loggedInSubject.next(true);
  }
  
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  setUsername(username: string | undefined) {
    if(username != undefined) {
      this.usernameForLogin.next(username);
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem('basket');
    this.loggedInSubject.next(false);
    this.subjetRole.next(null);
    this.subjectEmail.next(null);
    this.userIdSubject.next(null);
  }

  setLoggedInState(value: boolean, role?: string): void {
    if (!role) return;
    this.loggedInSubject.next(value);
    this.subjetRole.next(role);
  }

  setUsernameAndEmail(username: string, email: string) {
    this.username.next(username);
    this.subjectEmail.next(email);
  }
}
