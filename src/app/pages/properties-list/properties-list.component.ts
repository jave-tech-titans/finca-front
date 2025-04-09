import { Component } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { PropertyTileModel } from '../../models/PropertyTileModel';
import { PropertiesService } from '../../services/properties.service';
import { PropertiesFilter } from '../../models/PropertiesFIlter';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-properties-list',
  imports: [ButtonModule, TagModule, CommonModule, DataViewModule, PaginatorModule],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css'
})
export class PropertiesListComponent {
  properties: Array<PropertyTileModel> = []

  constructor(
    private service: PropertiesService
  ){
    service.getProperties(new PropertiesFilter('', '', 0, 0, 0, 0, 0)).then(([props, err])=>{
      if(err){
        console.log("error")
      }else{
        this.properties = props!
      }
    })
  }

  getProperties(){
    return this.properties
  }
}
