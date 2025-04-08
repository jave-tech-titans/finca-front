import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { UpdatePropertyModel } from '../../models/update-property-model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-update',
  templateUrl: './property-update.component.html',
  styleUrls: ['./property-update.component.css']
})
export class PropertyUpdateComponent implements OnInit {
  public propertyData: UpdatePropertyModel = new UpdatePropertyModel('', '', '', '', 0, 0, false, false, false, 0);
  public errorMessage: string | null = null;
  private propertyId: string | null = null;
  private propertiesService: PropertiesService;
  private router: Router;
  private route: ActivatedRoute;

  constructor(propertiesService: PropertiesService, router: Router, route: ActivatedRoute) {
    this.propertiesService = propertiesService;
    this.router = router;
    this.route = route;
  }

  public async ngOnInit(): Promise<void> {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId) {
      const [property, error] = await this.propertiesService.getFullProperty(this.propertyId);
      if (error) {
        console.error('Error fetching property:', error);
        return;
      }
      this.propertyData = new UpdatePropertyModel(
        property!.name,
        property!.department,
        property!.enterType,
        property!.description,
        property!.numberRooms,
        property!.numberBathrooms,
        property!.isPetFriendly,
        property!.hasPool,
        property!.hasAsador,
        property!.nightPrice
      );
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.propertyId) {
      const [property, error] = await this.propertiesService.updateProperty(this.propertyId, this.propertyData);
      if (error) {
        this.errorMessage = error;
        return;
      }
      this.router.navigate(['/properties']);
    }
  }
}