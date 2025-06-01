import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { loginRoute } from '../../app.routes';
import { AuthService } from '../../services/auth.service';
import { AccountModel } from '../../models/AccountModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CardModule, InputTextModule, FloatLabelModule, ButtonModule, ToastModule, FormsModule, SelectButtonModule, CommonModule],
  templateUrl: './register.component.html',
  providers: [MessageService],
  standalone: true
})
export class RegisterComponent {
  names: string = "";
  lastNames: string = "";
  number: string = "";
  password: string = "";
  email: string = "";
  role: string = "";

  // Error states
  nameError: string = "";
  lastNameError: string = "";
  emailError: string = "";
  passwordError: string = "";
  phoneError: string = "";
  roleError: string = "";
  registerError: string = "";
  successMessage: string = "";

  roleOptions = [
    {label: "Usuario", value:"USER"},
    {label:"Dueño", value: "LANDLORD"}
  ];

  constructor(
    private router: Router,
    private service: AuthService,
    private messageService: MessageService
  ){}

  validateForm(): boolean {
    let isValid = true;
    
    // Reset all errors
    this.nameError = "";
    this.lastNameError = "";
    this.emailError = "";
    this.passwordError = "";
    this.phoneError = "";
    this.roleError = "";
    this.registerError = "";

    if (!this.names.trim()) {
      this.nameError = "El nombre es requerido";
      isValid = false;
    }

    if (!this.lastNames.trim()) {
      this.lastNameError = "Los apellidos son requeridos";
      isValid = false;
    }

    if (!this.email) {
      this.emailError = "El correo electrónico es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = "El formato del correo electrónico es inválido";
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = "La contraseña es requerida";
      isValid = false;
    } else if (this.password.length < 6) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (!this.number) {
      this.phoneError = "El número de teléfono es requerido";
      isValid = false;
    }

    if (!this.role) {
      this.roleError = "Debe seleccionar un rol";
      isValid = false;
    }

    return isValid;
  }

  goToLogin() {
    this.router.navigate([`/${loginRoute}`]);
  }

  async register() {
    if (!this.validateForm()) {
      return;
    }

    const [success, error] = await this.service.registerAccount(
      new AccountModel(this.names, this.lastNames, this.email, this.password, this.number, this.role)
    );

    if (error) {
      this.registerError = error;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 4000
      });
    } else {
      this.successMessage = 'Revisa tu correo para confirmar la cuenta';
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Revisa tu correo para confirmar la cuenta',
        life: 4000
      });
      setTimeout(() => {
        this.router.navigate([`/${loginRoute}`]);
      }, 4200);
    }
  }
}
