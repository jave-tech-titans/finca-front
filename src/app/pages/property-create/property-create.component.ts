import { Component } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { CreatePropertyModel } from '../../models/create-property-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-create',
  templateUrl: './property-create.component.html',
  styleUrls: ['./property-create.component.css']
})
export class PropertyCreateComponent {
  public propertyData: CreatePropertyModel = new CreatePropertyModel('', '', '', '', 0, 0, false, false, false, 0);
  public errorMessage: string | null = null;
  private propertiesService: PropertiesService;
  private router: Router;

  constructor(propertiesService: PropertiesService, router: Router) {
    this.propertiesService = propertiesService;
    this.router = router;
  }

  public async onSubmit(): Promise<void> {
    const [property, error] = await this.propertiesService.createProperty(this.propertyData);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.router.navigate(['/properties']);
  }
}
