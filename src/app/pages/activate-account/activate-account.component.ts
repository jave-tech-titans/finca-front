import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {
  public code: string = '';
  public errorMessage: string | null = null;
  private authService: AuthService;
  private router: Router;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public async onSubmit(): Promise<void> {
    const [success, error] = await this.authService.activateAccount(this.code);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.router.navigate(['/properties']);
  }
}