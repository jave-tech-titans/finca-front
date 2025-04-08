import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { RentalRequestModel } from '../../models/rental-request-model';

@Component({
  selector: 'app-rental-request',
  templateUrl: './rental-request.component.html',
  styleUrls: ['./rental-request.component.css']
})
export class RentalRequestComponent implements OnInit {
  public rentalRequests: RentalRequestModel[] = [];
  private rentalService: RentalService;

  constructor(rentalService: RentalService) {
    this.rentalService = rentalService;
  }

  public async ngOnInit(): Promise<void> {
    const [requests, error] = await this.rentalService.getUserRentalRequests();
    if (error) {
      console.error('Error fetching rental requests:', error);
      return;
    }
    this.rentalRequests = requests!;
  }
}