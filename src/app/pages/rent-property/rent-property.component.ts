import { PropertiesService } from '../../services/properties.service';
import { PropertyModel } from '../../models/PropertyModel';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from "../shared/menu/menu.component";

@Component({
  selector: 'app-rent-property',
  imports: [ToastModule, GalleriaModule, ButtonModule, MenuComponent],
  templateUrl: './rent-property.component.html',
  styleUrl: './rent-property.component.css',
  providers: [MessageService]
})
export class RentPropertyComponent {

  property: PropertyModel | null = null
  loading : boolean = false

  constructor(
    private service : PropertiesService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(){
    this.loading = true 
    const idParam = this.route.snapshot.paramMap.get('id');
    this.service.getFullProperty(idParam ?? "").then(([prop, err])=>{
      if(prop){
        this.property = prop 
        this.loading = false
      }
    })
  }

  requestProperty(){

  }
}
