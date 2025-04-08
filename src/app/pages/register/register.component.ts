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
import { loginRoute, mainPageRoute, registerRoute } from '../../app.routes';
import { AuthService } from '../../services/auth.service';
import { AccountModel } from '../../models/AccountModel';

@Component({
  selector: 'app-register',
  imports: [CardModule, InputTextModule, FloatLabelModule, ButtonModule, ToastModule, FormsModule, SelectButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent {
  names:string = ""
  lastNames:string = ""
  number: string = ""
  password:string = ""
  email:string = ""
  role: string = ""

  roleOptions = [
    {label: "Usuario", value:"USER"},
    {label:"Dueño", value: "LANDLORD"}
  ];

  constructor(
    private router: Router,
    private service: AuthService,
    private messageService: MessageService
  ){}

  goToLogin(){
    this.router.navigate([`/${loginRoute}`]);
  }

  async register(){
    const [success, error] = await this.service.registerAccount(new AccountModel(this.names, this.lastNames, this.email, this.password, this.number, this.role))
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
        detail: 'Revisa tu correo para confirmar la cuenta',
        life: 4000
      })
      setTimeout(() => {
        this.router.navigate([`/${loginRoute}`]);
      }, 4200);
    }
  }
}
