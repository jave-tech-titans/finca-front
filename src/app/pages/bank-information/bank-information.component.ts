import { Component, OnInit } from '@angular/core';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { CreatePaymentModel } from '../../models/CreatePaymentModel'; 
interface Bank {
  id: string;
  name: string;
}

@Component({
  selector: 'app-bank-information',
  standalone: true,
  imports: [
    OrderListModule,InputTextModule,ToastModule,CardModule,ButtonModule,FloatLabelModule,MessageModule,ProgressSpinnerModule,FormsModule, CommonModule
  ],
  templateUrl: './bank-information.component.html',
  styleUrls: ['./bank-information.component.css'],
  providers: [MessageService]
})
export class BankInformationComponent implements OnInit {
  banks: Bank[] = [];
  selectedBank: Bank [] = [];
  paymentModel: CreatePaymentModel = new CreatePaymentModel('', 0);
  isLoading = false;
  private requestId: string;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    //  la ruta
    this.requestId = this.route.snapshot.paramMap.get('requestId') || 'default-id';
  }

  ngOnInit(): void {
    this.loadBanks();
  }

  async loadBanks(): Promise<void> {
    this.isLoading = true;
    this.messageService.add({ severity: 'info', summary: 'Cargando', detail: 'Cargando lista de bancos...' });

    const [banks, error] = await this.paymentService.getBanks();
    this.isLoading = false;

    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    } else {
      this.banks = banks!.map((name, index) => ({ id: `bank-${index}`, name }));
    }
  }

  async pay(form: NgForm): Promise<void> {
    if (form.invalid || !this.selectedBank) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar un número de cuenta y seleccionar un banco' });
      return;
    }
    //validar longitud del numero de cuenta de 10 a 20 
    //const accountNumberLength = this.paymentModel.accountNumber.length;
    //if (accountNumberLength < 10 || accountNumberLength > 20) {
    //  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El número de cuenta debe tener entre 10 y 20 dígitos' });
    //  return;
    //}

    this.paymentModel.bank = this.selectedBank[0].name;
    this.isLoading = true;
    this.messageService.add({ severity: 'info', summary: 'Procesando', detail: 'Procesando pago...' });

    const [result, error] = await this.paymentService.paySchedule(this.requestId, this.paymentModel);
    this.isLoading = false;

    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
    } else {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago realizado con éxito' });
      form.resetForm();
      this.paymentModel = new CreatePaymentModel('', 0);
      this.selectedBank = [];
    }
  }
}