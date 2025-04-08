import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { PropertyModel } from '../../models/property-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  public property: PropertyModel | null = null;
  private propertiesService: PropertiesService;
  private route: ActivatedRoute;

  constructor(propertiesService: PropertiesService, route: ActivatedRoute) {
    this.propertiesService = propertiesService;
    this.route = route;
  }

  public async ngOnInit(): Promise<void> {
    const propId = this.route.snapshot.paramMap.get('id');
    if (propId) {
      const [property, error] = await this.propertiesService.getFullProperty(propId);
      if (error) {
        console.error('Error fetching property:', error);
        return;
      }
      this.property = property!;
    }
  }
}