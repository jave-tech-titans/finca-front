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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-properties',
  imports: [PropertiesListComponent, MenuComponent, FormsModule, PaginatorModule, CommonModule],
  templateUrl: './search-properties.component.html',
  standalone: true
})
export class SearchPropertiesComponent {
  filters: PropertiesFilter = new PropertiesFilter(null, null, null, null, null, null, null);
  properties: Array<PropertyTileModel> = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private service: PropertiesService,
    private router: Router,
  ){
    this.selectProperty = this.selectProperty.bind(this);
  }

  ngOnInit() {
    this.fetchProperties();
  }
  
  private async fetchProperties() {
    try {
      this.loading = true;
      this.error = null;
      const [props, err] = await this.service.getProperties(this.filters);
      
      if (err) {
        this.error = err;
        return;
      }

      this.properties = props ?? [];
    } catch (error) {
      this.error = 'An unexpected error occurred while fetching properties';
    } finally {
      this.loading = false;
    }
  }

  applyFilters = async () => {
    try {
      this.loading = true;
      this.error = null;
      this.properties = [];
      
      if (this.filters.page != null) {
        this.filters.page += 1;
      }

      const [props, err] = await this.service.getProperties(this.filters);
      
      if (err) {
        this.error = err;
        return;
      }

      this.properties = props ?? [];
    } catch (error) {
      this.error = 'An unexpected error occurred while applying filters';
    } finally {
      this.loading = false;
    }
  }

  onPageChange = (event: PaginatorState) => {
    this.filters.page = event.page ?? 1;
    this.applyFilters();
  }

  selectProperty = (property: PropertyTileModel) => {
    this.router.navigate([`/${rentPropertyRoute}`, property.id]);
  }
} 
