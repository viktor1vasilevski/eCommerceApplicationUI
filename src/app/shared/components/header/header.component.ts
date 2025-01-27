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

  constructor(private _authManagerService: AuthManagerService,
    private router: Router
  ) {
    this._authManagerService.role$.subscribe(role => {
      this.role = role;
    }),

    this._authManagerService.loggedIn$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })
  }


  onLogout() : void {
    debugger
    this._authManagerService.logout();
    this.router.navigate(['/home']);
  }
}
