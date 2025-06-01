import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../services/properties.service';
import { PropertyModel } from '../../models/PropertyModel';
import { UpdatePropertyDTO } from '../../models/UpdatePropertyModel';
import { MenuComponent } from '../shared/menu/menu.component';
import { myPropertiesRoute } from '../../app.routes';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-property-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuComponent,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    FileUploadModule,
    GalleriaModule,
    ProgressSpinnerModule
  ],
  templateUrl: './propertymanager.component.html',
  providers: [MessageService]
})
export class PropertyManagerComponent implements OnInit {
  propertyId: string | null = null;
  property: UpdatePropertyDTO = new UpdatePropertyDTO();
  selectedImage: File | null = null;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  isCreateMode = false;
  departments: string[] = [];
  isUploadingImage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PropertiesService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    this.isCreateMode = !this.propertyId;

    await Promise.all([
      this.loadDepartments(),
      !this.isCreateMode ? this.loadProperty() : Promise.resolve()
    ]);

  }

  private async loadDepartments() {
    try {
      const [departments, error] = await this.service.getDepartments();
      if (error) {
        this.error = error;
        return;
      }
      this.departments = departments || [];
    } catch (err) {
      this.error = 'Failed to load departments';
    }
  }

  private async loadProperty() {
    try {
      this.isLoading = true;
      this.error = null;

      if (!this.propertyId) return;

      const [property, error] = await this.service.getFullProperty(this.propertyId);
      
      if (error) {
        this.error = error;
        return;
      }

      if (property) {
        // Map the full property to update DTO
        this.property = {
          name: property.name,
          department: property.department,
          description: property.description,
          enterType: property.enterType,
          numberRooms: property.numberRooms,
          numberBathrooms: property.numberBathrooms,
          isPetFriendly: property.isPetFriendly,
          hasPool: property.hasPool,
          hasAsador: property.hasAsador,
          nightPrice: property.nightPrice
        };
      }
    } catch (err) {
      this.error = 'Failed to load property';
    } finally {
      this.isLoading = false;
    }
  }

  async handleSubmit() {
    try {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      if (this.isCreateMode) {
        const [result, error] = await this.service.createProperty(this.property);
        if (error) {
          this.error = error;
          return;
        }
        this.success = 'Property created successfully';
        await this.router.navigate([`/${myPropertiesRoute}`]);
      } else if (this.propertyId) {
        const [result, error] = await this.service.updateProperty(this.property, this.propertyId);
        if (error) {
          this.error = error;
          return;
        }
        this.success = 'Property updated successfully';
        await this.router.navigate([`/${myPropertiesRoute}`]);
      }
    } catch (err) {
      this.error = 'Failed to save property';
    } finally {
      this.isLoading = false;
    }
  }

  async handleDeactivate() {
    if (!this.propertyId || this.isCreateMode) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      const [result, error] = await this.service.deactivateProperty(this.propertyId);
      
      if (error) {
        this.error = error;
        return;
      }

      this.success = 'Property deactivated successfully';
      await this.router.navigate([`/${myPropertiesRoute}`]);
    } catch (err) {
      this.error = 'Failed to deactivate property';
    } finally {
      this.isLoading = false;
    }
  }

  async onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (!files || files.length === 0 || !this.propertyId) return;

    try {
      this.isUploadingImage = true;
      this.error = null;
      this.success = null;

      const [result, error] = await this.service.uploadPicture(files[0], this.propertyId);
      
      if (error) {
        this.error = error;
        return;
      }

      this.success = 'Image uploaded successfully';
      element.value = ''; // Reset file input
    } catch (err) {
      this.error = 'Failed to upload image';
    } finally {
      this.isUploadingImage = false;
    }
  }
}