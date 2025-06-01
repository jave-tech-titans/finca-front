import { Component, OnInit } from '@angular/core';
import { PropertyTileModel } from '../../models/PropertyTileModel';
import { PropertiesService } from '../../services/properties.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../shared/menu/menu.component';
import { PropertiesListComponent } from '../shared/properties-list/properties-list.component';
import { managePropertyRoute, createPropertyRoute } from '../../app.routes';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, PropertiesListComponent, MenuComponent],
  templateUrl: './my-properties.component.html',
})
export class MyPropertiesComponent implements OnInit {
  properties: PropertyTileModel[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private service: PropertiesService,
    private router: Router
  ) {
    this.handlePropertyClick = this.handlePropertyClick.bind(this);
  }

  async ngOnInit() {
    await this.loadProperties();
  }

  private async loadProperties() {
    try {
      this.isLoading = true;
      this.error = null;
      const [props, error] = await this.service.getMyProperties(this.currentPage);
      
      if (error) {
        this.error = error;
        return;
      }

      this.properties = props ?? [];
    } catch (err) {
      this.error = 'Failed to load properties';
    } finally {
      this.isLoading = false;
    }
  }

  async handlePageChange(page: number) {
    this.currentPage = page;
    await this.loadProperties();
  }

  handlePropertyClick(property: PropertyTileModel) {
    this.router.navigate([`/${managePropertyRoute}`, property.id]);
  }

  handleCreateProperty() {
    this.router.navigate([`/${createPropertyRoute}`]);
  }
}
