import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private authService: AuthService;
  private router: Router;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public isLoggedIn(): boolean {
    return !!this.authService.getAccessToken();
  }

  public async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}