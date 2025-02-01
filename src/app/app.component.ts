import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AuthManagerService } from './shared/services/auth-manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isAdmin: boolean = false;

  constructor(private _authManagerService: AuthManagerService
  ) {
    this._authManagerService.role$.subscribe(role => {
      this.isAdmin = role === 'Admin';
    })
  }


}
