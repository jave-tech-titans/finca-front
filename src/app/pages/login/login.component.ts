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


@Component({
  selector: 'app-login',
  imports: [CardModule, InputTextModule, FormsModule, FloatLabelModule, ButtonModule, RouterModule, ToastModule],
  providers: [ MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email:string = ''
  password:string = ''

  authService: AuthService

  constructor(
    authService: AuthService, 
    private messageService: MessageService, 
    private router: Router
  ){
    this.authService = authService
  }

  async login(){
    const [success, error] = await this.authService.loginAccount(new LoginModel(this.email, this.password))
    if(error){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 4000
      })
    }else{
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Iniciaste sesion',
        life: 4000
      })
      setTimeout(() => {
        this.router.navigate([`/${homepageRoute}`]);
      }, 4200);
    }
  }

  goToRegister(){
    this.router.navigate([`/${registerRoute}`]);
  }

}
