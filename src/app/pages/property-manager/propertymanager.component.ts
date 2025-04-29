import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UpdatePropertyDTO } from '../../models/UpdatePropertyModel'; 
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-property-manager',
  templateUrl: './propertymanager.component.html',
  styleUrl: './propertymanager.component.css',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    CheckboxModule,
    ButtonModule,
    FileUploadModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class PropertyManagerComponent implements OnInit {

  propertyForm!: FormGroup;
  loading: boolean = false;
  propertyId!: string;

  constructor(
    private fb: FormBuilder,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id') ?? '';

    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      enterType: ['', Validators.required],
      description: [''],
      numberRooms: [0, Validators.required],
      numberBathrooms: [0, Validators.required],
      isPetFriendly: [false],
      hasPool: [false],
      hasAsador: [false],
      nightPrice: [0, Validators.required],
    });

    this.loadProperty();
  }

  async loadProperty() {
    this.loading = true;
    const [property, error] = await this.propertiesService.getFullProperty(this.propertyId);
    if (property) {
      this.propertyForm.patchValue(property);
    } else if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
    this.loading = false;
  }

  async saveChanges() {
    if (this.propertyForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Por favor llena todos los campos requeridos.' });
      return;
    }

    const updateData: UpdatePropertyDTO = this.propertyForm.value;
    const [result, error] = await this.propertiesService.updateProperty(updateData, this.propertyId);

    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'La propiedad fue actualizada.' });
    } else if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
  }

  async uploadImage(event: any) {
    if (!event?.files?.length) {
      return;
    }
    const file = event.files[0];
  
    const [result, error] = await this.propertiesService.uploadPicture(file, this.propertyId);
  
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Imagen subida', detail: 'La imagen fue subida correctamente.' });
    } else if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
  }
  
  async deactivateProperty() {
    const [result, error] = await this.propertiesService.deactivateProperty(this.propertyId);

    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Propiedad desactivada', detail: 'La propiedad fue desactivada.' });
      this.router.navigate(['/']); 
    } else if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    }
  }
}
