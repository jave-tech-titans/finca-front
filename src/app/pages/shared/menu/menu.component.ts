import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { homepageRoute, myPropertiesRoute, ownerRentalRequests, propertiesRoute } from '../../../app.routes';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  imports: [CommonModule],
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  links: Array<{label:string, href:string}> = []

  constructor(
    private router: Router,
    private authService : AuthService
  ) {
  }

  ngOnInit() {
    if(this.authService.landlordRole){
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
          href : `/${ownerRentalRequests}`
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
        }
      ]
    }
  }

  logoutUser() {
    this.authService.logout
    this.router.navigate(["/login"]);
  }
}
