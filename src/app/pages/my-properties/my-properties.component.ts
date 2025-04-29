import { Component } from '@angular/core';
import { PropertyTileModel } from '../../models/PropertyTileModel';
import { PropertiesService } from '../../services/properties.service';
import { Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { managePropertyRoute } from '../../app.routes';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../shared/menu/menu.component';
import { PropertiesListComponent } from '../shared/properties-list/properties-list.component';

@Component({
  selector: 'app-my-properties',
  imports: [PropertiesListComponent, MenuComponent, FormsModule, PaginatorModule],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.css'
})
export class MyPropertiesComponent {
  properties: Array<PropertyTileModel> = []
  page:number = 1
  constructor(
    private service: PropertiesService,
    private router: Router,
  ){
    this.selectProperty = this.selectProperty.bind(this);
  }

  ngOnInit() {
    this.service.getMyProperties(1).then(([props, err]) => {
      this.properties = props ?? [];
      console.log(err)
    });
  }
  
  getProperties(){
    return this.properties
  }

  onPageChange=(event: PaginatorState)=>{
    this.page = event.page ?? 1
    this.properties = []
    this.page +=1
    this.service.getMyProperties(this.page).then(([props, err]) => {
      this.properties = props ?? [];
      this.properties.forEach((p)=>console.log("image is " + p.imageUrl))
    });
  }

  selectProperty=(property: PropertyTileModel)=>{
    this.router.navigate([`/${managePropertyRoute}`, property.id])
  }
}
