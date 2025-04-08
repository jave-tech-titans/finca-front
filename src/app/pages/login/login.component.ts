import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginModel } from '../../models/LoginModel';


@Component({
  selector: 'app-login',
  imports: [CardModule, InputTextModule, FormsModule, FloatLabelModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email:string = ''
  password:string = ''

  authService: AuthService

  constructor(authService: AuthService){
    this.authService = authService
  }

  login(){
    this.authService.loginAccount(new LoginModel(this.email, this.password)).then((v)=>
      console.log(`result ${v}`)
    )
  }

}
