import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties.service';
import { PropertyTileModel } from '../../models/PropertyTileModel';
import { PropertiesFilter } from '../../models/PropertiesFIlter';
import { PropertiesListComponent } from "../shared/properties-list/properties-list.component";
import { MenuComponent } from "../shared/menu/menu.component";
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { rentPropertyRoute } from '../../app.routes';


@Component({
  selector: 'app-search-properties',
  imports: [PropertiesListComponent, MenuComponent, FormsModule, PaginatorModule],
  templateUrl: './search-properties.component.html',
  styleUrl: './search-properties.component.css'
})
export class SearchPropertiesComponent {
  filters: PropertiesFilter = new PropertiesFilter(null, null, null, null, null, null, null);
  properties: Array<PropertyTileModel> = []
  constructor(
    private service: PropertiesService,
    private router: Router,
  ){
    this.selectProperty = this.selectProperty.bind(this);
  }

  ngOnInit() {
    this.service.getProperties(this.filters).then(([props, err]) => {
      this.properties = props ?? [];
      console.log(err)
    });
  }
  
  getProperties(){
    return this.properties
  }

  applyFilters= ()=>{
    this.properties = []
    if (this.filters.page != null){
      this.filters.page +=1
    }
    this.service.getProperties(this.filters).then(([props, err]) => {
      this.properties = props ?? [];
      this.properties.forEach((p)=>console.log("image is " + p.imageUrl))
    });
  }

  onPageChange=(event: PaginatorState)=>{
    this.filters.page = event.page ?? 1
    this.applyFilters()
  }

  selectProperty=(property: PropertyTileModel)=>{
    this.router.navigate([`/${rentPropertyRoute}`, property.id])
  }
} 
