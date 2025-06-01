import { PropertiesService } from '../../services/properties.service';
import { PropertyModel } from '../../models/PropertyModel';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from "../shared/menu/menu.component";
import { requestRentRoute } from '../../app.routes';

@Component({
  selector: 'app-rent-property',
  standalone: true,
  imports: [CommonModule, ToastModule, GalleriaModule, ButtonModule, MenuComponent],
  templateUrl: './rent-property.component.html',
  providers: [MessageService]
})
export class RentPropertyComponent implements OnInit {
  property: PropertyModel | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private service: PropertiesService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadProperty();
  }

  private async loadProperty() {
    try {
      this.loading = true;
      this.error = null;

      const idParam = this.route.snapshot.paramMap.get('id');
      if (!idParam) {
        this.error = 'No property ID provided';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error
        });
        return;
      }

      const [prop, err] = await this.service.getFullProperty(idParam);
      
      if (err) {
        this.error = err;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err
        });
        return;
      }

      if (prop) {
        this.property = prop;
      } else {
        this.error = 'Property not found';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error
        });
      }
    } catch (error) {
      this.error = 'An unexpected error occurred while loading the property';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error
      });
    } finally {
      this.loading = false;
    }
  }

  async requestProperty() {
    if (!this.property?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Property information is not available'
      });
      return;
    }

    try {
      await this.router.navigate([`/${requestRentRoute}`, this.property.id]);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to navigate to rental request page'
      });
    }
  }

  formatBoolean(value: boolean | undefined): string {
    return value ? 'Sí' : 'No';
  }
}
