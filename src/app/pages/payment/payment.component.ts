import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CreatePaymentModel } from '../../models/create-payment-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  public paymentData: CreatePaymentModel = new CreatePaymentModel('', 0);
  public errorMessage: string | null = null;
  private paymentService: PaymentService;
  private router: Router;

  constructor(paymentService: PaymentService, router: Router) {
    this.paymentService = paymentService;
    this.router = router;
  }

  public async onSubmit(): Promise<void> {
    const [success, error] = await this.paymentService.createPayment(this.paymentData);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.router.navigate(['/rental-requests']);
  }
}