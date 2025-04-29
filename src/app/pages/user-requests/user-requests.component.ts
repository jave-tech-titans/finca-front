import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { CommonModule } from '@angular/common';
import { RentalRequestModel } from '../../models/RentalRequestModel';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css'],
  imports: [CommonModule, ButtonModule, CardModule, ProgressSpinnerModule],
  providers: [MessageService],
  standalone: true,
})
export class UserRequestsComponent implements OnInit {
  rentalRequests: RentalRequestModel[] = [];
  loading: boolean = false;
  currentPage: number = 1;

  constructor(
    private rentalService: RentalService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadRentalRequests();
  }

  async loadRentalRequests() {
    this.loading = true;
    const [requests, error] = await this.rentalService.getUserRentalRequests(
      this.currentPage
    );
    this.loading = false;

    if (requests) {
      this.rentalRequests = requests;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error || 'No se pudieron cargar las solicitudes',
      });
    }
  }

  async cancelRentalRequest(requestId: string) {
    const [response, error] = await this.rentalService.cancelRentalRequest(
      requestId
    );

    if (response) {
      this.messageService.add({
        severity: 'success',
        summary: 'Solicitud Cancelada',
        detail: 'La solicitud ha sido cancelada',
      });
      this.loadRentalRequests();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error || 'No se pudo cancelar la solicitud',
      });
    }
  }
}
