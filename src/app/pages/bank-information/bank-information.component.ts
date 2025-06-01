import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { RentalService } from '../../services/rental.service';
import { CreatePaymentModel } from '../../models/CreatePaymentModel';
import { RentalRequestModel } from '../../models/RentalRequestModel';
import { MenuComponent } from '../shared/menu/menu.component';

interface Bank {
  id: string;
  name: string;
}

@Component({
  selector: 'app-bank-information',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './bank-information.component.html',
})
export class BankInformationComponent implements OnInit {
  banks: Bank[] = [];
  selectedBank: string = '';
  paymentModel: CreatePaymentModel = new CreatePaymentModel('', 0);
  rentalRequest: RentalRequestModel | null = null;
  isLoading = false;
  error: string | null = null;
  private requestId: string;

  constructor(
    private paymentService: PaymentService,
    private rentalService: RentalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.requestId = this.route.snapshot.paramMap.get('requestId') || '';
    if (!this.requestId) {
      this.error = 'No request ID provided';
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.requestId) return;
    
    await Promise.all([
      this.loadBanks(),
      this.loadRentalRequest()
    ]);
  }

  private async loadBanks(): Promise<void> {
    try {
      this.isLoading = true;
      const [banks, error] = await this.paymentService.getBanks();
      
      if (error) {
        this.error = error;
        return;
      }

      if (banks) {
        this.banks = banks.map((name, index) => ({
          id: `bank-${index}`,
          name
        }));
      }
    } catch (err) {
      this.error = 'Failed to load banks';
    } finally {
      this.isLoading = false;
    }
  }

  private async loadRentalRequest(): Promise<void> {
    try {
      this.isLoading = true;
      const [requests, error] = await this.rentalService.getUserRentalRequests(1);
      
      if (error) {
        this.error = error;
        return;
      }

      if (requests) {
        this.rentalRequest = requests.find(req => req.id === this.requestId) || null;
        if (!this.rentalRequest) {
          this.error = 'Rental request not found';
        }
      }
    } catch (err) {
      this.error = 'Failed to load rental request';
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async handlePayment(form: NgForm): Promise<void> {
    if (form.invalid || !this.selectedBank) {
      this.error = 'Please select a bank';
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      
      this.paymentModel.bank = this.selectedBank;
      this.paymentModel.accountNumber = 0; // Not needed as per your requirement

      const [result, error] = await this.paymentService.paySchedule(this.requestId, this.paymentModel);

      if (error) {
        this.error = error;
        return;
      }

      // Navigate to user requests on success
      await this.router.navigate(['/userrequests']);
    } catch (err) {
      this.error = 'Payment processing failed';
    } finally {
      this.isLoading = false;
    }
  }
}