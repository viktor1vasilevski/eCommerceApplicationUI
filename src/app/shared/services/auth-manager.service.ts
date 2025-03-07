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

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  private subjetRole = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.subjetRole.asObservable();

  private subjectEmail = new BehaviorSubject<string | null>(this.getEmail());
  email$ = this.subjectEmail.asObservable();

  private username = new BehaviorSubject<string | null>(this.getUsername());
  username$ = this.username.asObservable();

  private usernameForLogin = new BehaviorSubject<string>("");
  getUsernameForLogin$ = this.usernameForLogin.asObservable();

  constructor() { }

  setSession(email: string, token: string, role: string, username: string): void {
    if (!token || !role || !username) return;
  
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
    this.loggedInSubject.next(false);
    this.subjetRole.next(null);
    this.subjectEmail.next(null);
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
