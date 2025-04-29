import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RentalService } from '../../services/rental.service';
import { OwnerRentalRequestModel } from '../../models/OnwerRentalRequestModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-requests',
  templateUrl: './owner-requests.component.html',
  styleUrl: './owner-requests.component.css',
  imports: [
    TableModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    CardModule,
    TagModule,
    CommonModule,
  ],
  providers: [MessageService],
  standalone: true,
})
export class OwnerRequestsComponent {
  rentalRequests: OwnerRentalRequestModel[] = [];

  constructor(
    private rentalService: RentalService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadRentalRequests();
  }

  async loadRentalRequests() {
    const [requests, error] = await this.rentalService.getOwnerRentalRequests(
      1
    );
    if (requests) {
      this.rentalRequests = requests;
    } else {
      this.rentalRequests = [];
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error || 'No se pudieron cargar las solicitudes',
      });
    }
  }

  async acceptRequest(requestId: string): Promise<void> {
    try {
      await this.rentalService.acceptRentalRequest(requestId);
      this.messageService.add({
        severity: 'success',
        summary: 'Solicitud Aceptada',
        detail: 'La solicitud fue aceptada',
      });
      await this.loadRentalRequests();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo aceptar la solicitud',
      });
    }
  }
}
