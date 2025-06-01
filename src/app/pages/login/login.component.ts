import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginModel } from '../../models/LoginModel';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { homepageRoute, registerRoute } from '../../app.routes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CardModule, InputTextModule, FormsModule, FloatLabelModule, ButtonModule, RouterModule, ToastModule, CommonModule],
  providers: [ MessageService],
  templateUrl: './login.component.html',
  standalone: true
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  constructor(
    private authService: AuthService, 
    private messageService: MessageService, 
    private router: Router
  ){}

  validateForm(): boolean {
    let isValid = true;
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';

    if (!this.email) {
      this.emailError = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'El formato del correo electrónico es inválido';
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = 'La contraseña es requerida';
      isValid = false;
    }

    return isValid;
  }

  async login() {
    if (!this.validateForm()) {
      return;
    }

    const [success, error] = await this.authService.loginAccount(new LoginModel(this.email, this.password));
    
    if (error) {
      this.loginError = error;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 4000
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Iniciaste sesión',
        life: 4000
      });
      setTimeout(() => {
        this.router.navigate([`/${homepageRoute}`]);
      }, 2000);
    }
  }

  goToRegister() {
    this.router.navigate([`/${registerRoute}`]);
  }
}
