import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { PropertyModel } from '../../models/PropertyModel';
import { UpdatePropertyDTO } from '../../models/UpdatePropertyModel';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-manager',
  templateUrl: './propertymanager.component.html',
  styleUrls: ['./propertymanager.component.css'],
  imports: [
    CommonModule,
    FormsModule,
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
  providers: [MessageService]
})
export class PropertyManagerComponent implements OnInit {

    propertyId: string = '';
    property: UpdatePropertyDTO = new UpdatePropertyDTO();
  
    selectedImage: File | null = null;
    loading: boolean = false;
  
    constructor(
      private route: ActivatedRoute,
      private service: PropertiesService,
      private messageService: MessageService
    ) {}
  
    ngOnInit(): void {
      this.propertyId = this.route.snapshot.paramMap.get('id') ?? '';
    }
  
    async updateProperty() {
      this.loading = true;
      const [result, error] = await this.service.updateProperty(this.property, this.propertyId);
      this.loading = false;
  
      if (error) {
        this.messageService.add({severity:'error', summary:'Error', detail: error});
      } else {
        this.messageService.add({severity:'success', summary:'Éxito', detail: 'Propiedad actualizada'});
      }
    }
  
    async uploadImage() {
      if (!this.selectedImage) return;
      const [result, error] = await this.service.uploadPicture(this.selectedImage, this.propertyId);
      if (error) {
        this.messageService.add({severity:'error', summary:'Error', detail: error});
      } else {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Imagen subida correctamente'});
      }
    }
  
    async deactivateProperty() {
      const [result, error] = await this.service.deactivateProperty(this.propertyId);
      if (error) {
        this.messageService.add({severity:'error', summary:'Error', detail: error});
      } else {
        this.messageService.add({severity:'warn', summary:'Desactivada', detail:'Propiedad desactivada'});
      }
    }
  
    onFileSelected(event: any) {
      this.selectedImage = event.files[0];
    }
  }