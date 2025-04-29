import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { homepageRoute } from '../../app.routes';

@Component({
  selector: 'app-confirm-acc',
  imports: [ToastModule],
  templateUrl: './confirm-acc.component.html',
  styleUrl: './confirm-acc.component.css'
})
export class ConfirmAccComponent {

  constructor(
    private service : AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService, 
    private router: Router,
  ){}
  
  ngOnInit(){
    const token = this.route.snapshot.paramMap.get('token') || "";  
    this.service.activateAccount(token).then(([jwt, err])=>{
      if(err){
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err,
              life: 4000
            })
          }else{
            this.messageService.add({
              severity: 'success',
              summary: 'Exito',
              detail: 'Cuenta activada',
              life: 4000
            })
            setTimeout(() => {
              this.router.navigate([`/${homepageRoute}`]);
            }, 4200);
          }
    })
  }
}
