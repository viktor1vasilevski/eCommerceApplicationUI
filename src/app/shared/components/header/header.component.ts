import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthManagerService } from '../../services/auth-manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  role: string | null = "";
  isLogged: boolean = false;
  username: string | null = '';
  email: string | null = ""


  constructor(private _authManagerService: AuthManagerService,
    private router: Router
  ) {
    this._authManagerService.role$.subscribe(role => {
      debugger
      this.role = role;
    }),
    this._authManagerService.email$.subscribe(mail => {
      debugger
      this.email = mail;
    }),

    this._authManagerService.username$.subscribe(username => {
      debugger
      this.username = username;
    }),


    this._authManagerService.loggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
  }


  onLogout() : void {
    this._authManagerService.logout();
    this.router.navigate(['/home']);
  }
}
