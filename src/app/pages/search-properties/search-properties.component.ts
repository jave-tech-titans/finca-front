import { Component } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { PropertyTileModel } from '../../models/PropertyTileModel';
import { PropertiesFilter } from '../../models/PropertiesFIlter';
import { PropertiesListComponent } from "../shared/properties-list/properties-list.component";
import { MenuComponent } from "../shared/menu/menu.component";
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-search-properties',
  imports: [PropertiesListComponent, MenuComponent, FormsModule, PaginatorModule],
  templateUrl: './search-properties.component.html',
  styleUrl: './search-properties.component.css'
})
export class SearchPropertiesComponent {
  filters: PropertiesFilter = new PropertiesFilter('', '', 0, 0, 0, 0, 0);
  properties: Array<PropertyTileModel> = []
  constructor(
    private service: PropertiesService
  ){}

  ngOnInit() {
    this.service.getProperties(new PropertiesFilter('', '', 0, 0, 0, 0, 0)).then(([props, err]) => {
      this.properties = props ?? [];
    });
  }
  
  getProperties(){
    return this.properties
  }

  applyFilters() {
    this.properties = []
    console.log("reloaded")
    this.service.getProperties(this.filters).then(([props, err]) => {
      this.properties = props ?? [];
    });
  }

  onPageChange(event: PaginatorState){
    this.filters.page = event.page ?? 1
    this.applyFilters()
  }
} 
