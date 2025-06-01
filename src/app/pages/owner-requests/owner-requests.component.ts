import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RentalService } from '../../services/rental.service';
import { OwnerRentalRequestModel } from '../../models/OnwerRentalRequestModel';
import { MenuComponent } from '../shared/menu/menu.component';
import { ratingRoute } from '../../app.routes';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-owner-requests',
  templateUrl: './owner-requests.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ToastModule,
  ],
  providers: [MessageService]
})
export class OwnerRequestsComponent implements OnInit {
  rentalRequests: OwnerRentalRequestModel[] = [];
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private rentalService: RentalService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadRentalRequests();
  }

  async loadRentalRequests() {
    try {
      this.isLoading = true;
      this.error = null;
      const [requests, error] = await this.rentalService.getOwnerRentalRequests(1);
      
      if (error) {
        this.error = error;
        return;
      }
      
      this.rentalRequests = requests || [];
    } catch (err) {
      this.error = 'Failed to load rental requests';
    } finally {
      this.isLoading = false;
    }
  }

  async handleAcceptRequest(requestId: string) {
    try {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      const [result, error] = await this.rentalService.acceptRentalRequest(requestId);
      
      if (error) {
        this.error = error;
        return;
      }

      this.success = 'Request accepted successfully';
      await this.loadRentalRequests();
    } catch (err) {
      this.error = 'Failed to accept request';
    } finally {
      this.isLoading = false;
    }
  }

  async handleDenyRequest(requestId: string) {
    try {
      this.isLoading = true;
      this.error = null;
      this.success = null;

      const [result, error] = await this.rentalService.cancelRentalRequest(requestId);
      
      if (error) {
        this.error = error;
        return;
      }

      this.success = 'Request denied successfully';
      await this.loadRentalRequests();
    } catch (err) {
      this.error = 'Failed to deny request';
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRating(requestId: string) {
    this.router.navigate([`/${ratingRoute}`, requestId]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REQUESTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'DENIED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
