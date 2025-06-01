import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { homepageRoute, myPropertiesRoute, ownerRequests, propertiesRoute, userRequests } from '../../../app.routes';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  imports: [CommonModule],
})
export class MenuComponent {

  links: Array<{label:string, href:string}> = []

  constructor(
    private router: Router,
    private authService : AuthService
  ) {
  }

  ngOnInit() {
    if(this.authService.isLandlord){
      this.links = [
        {
          label: "Principal",
          href : `/${homepageRoute}`
        },
        {
          label: "Mis fincas",
          href : `/${myPropertiesRoute}`
        },
        {
          label: "Mis solicitudes",
          href : `/${ownerRequests}`
        }
      ]
    }else{
      this.links = [
        {
          label: "Principal",
          href : `/${homepageRoute}`
        },
        {
          label: "Buscar fincas",
          href : `/${propertiesRoute}`
        },
        {
          label: "Mis solicitudes",
          href : `/${userRequests}`
        },
      ]
    }
  }

  logoutUser() {
    this.authService.logout
    this.router.navigate(["/login"]);
  }
}
