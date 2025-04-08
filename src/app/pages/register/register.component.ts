import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccountModel } from '../../models/AccountModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerData: AccountModel = new AccountModel('', '', '', '', '', 'USER');
  public errorMessage: string | null = null;
  private authService: AuthService;
  private router: Router;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  public async onSubmit(): Promise<void> {
    const [success, error] = await this.authService.registerAccount(this.registerData);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.router.navigate(['/activate-account']);
  }
}