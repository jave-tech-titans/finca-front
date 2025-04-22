import { Component, Input } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { PropertyTileModel } from '../../../models/PropertyTileModel';
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
  @Input() properties: Array<PropertyTileModel> = []
  @Input() clickCallback : Function | null = null

  constructor(
  ){}

  getProperties(){
    return this.properties
  }

  onClick(property: PropertyTileModel){
    console.log("calling")
    this.clickCallback?.(property)
  }
}
