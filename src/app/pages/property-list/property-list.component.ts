import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { PropertyTileModel } from '../../models/property-tile-model';
import { PropertiesFilter } from '../../models/properties-filter';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  public properties: PropertyTileModel[] = [];
  public filter: PropertiesFilter = new PropertiesFilter();
  private propertiesService: PropertiesService;

  constructor(propertiesService: PropertiesService) {
    this.propertiesService = propertiesService;
  }

  public async ngOnInit(): Promise<void> {
    await this.loadProperties();
  }

  private async loadProperties(): Promise<void> {
    const [properties, error] = await this.propertiesService.getProperties(this.filter);
    if (error) {
      console.error('Error fetching properties:', error);
      return;
    }
    this.properties = properties!;
  }
}