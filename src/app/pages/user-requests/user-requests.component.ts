import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { CommonModule } from '@angular/common';
import { RentalRequestModel } from '../../models/RentalRequestModel';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuComponent } from '../shared/menu/menu.component';
import { Router } from '@angular/router';
import { ratingRoute, paymentRoute } from '../../app.routes';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  imports: [CommonModule, ButtonModule, CardModule, ProgressSpinnerModule, MenuComponent],
  providers: [MessageService],
  standalone: true,
})
export class UserRequestsComponent implements OnInit {
  rentalRequests: RentalRequestModel[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = 1;

  constructor(
    private rentalService: RentalService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRentalRequests();
  }

  async loadRentalRequests() {
    try {
      this.loading = true;
      this.error = null;
      const [requests, error] = await this.rentalService.getUserRentalRequests(this.currentPage);

      if (error) {
        this.error = error;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
        return;
      }

      if (requests) {
        this.rentalRequests = requests;
      }
    } catch (err) {
      this.error = 'An unexpected error occurred while loading requests';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error
      });
    } finally {
      this.loading = false;
    }
  }

  canRate(status: string): boolean {
    return status.toUpperCase() === 'COMPLETED';
  }

  canPay(status: string): boolean {
    return status.toUpperCase() === 'APPROVED';
  }

  async pay(requestId: string): Promise<void> {
    try {
      await this.router.navigate(['rental-requests', requestId, 'payment']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to navigate to payment page'
      });
    }
  }

  async rate(requestId: string): Promise<void> {
    await this.router.navigate([`/${ratingRoute}`, requestId]);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'REQUESTED': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'DENIED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    };
    return statusMap[status.toUpperCase()] || 'bg-gray-100 text-gray-800';
  }
}
