import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { OwnerRentalRequestModel } from '../../models/owner-rental-request-model';

@Component({
  selector: 'app-owner-rental-request',
  templateUrl: './owner-rental-request.component.html',
  styleUrls: ['./owner-rental-request.component.css']
})
export class OwnerRentalRequestComponent implements OnInit {
  public rentalRequests: OwnerRentalRequestModel[] = [];
  private rentalService: RentalService;

  constructor(rentalService: RentalService) {
    this.rentalService = rentalService;
  }

  public async ngOnInit(): Promise<void> {
    const [requests, error] = await this.rentalService.getOwnerRentalRequests();
    if (error) {
      console.error('Error fetching owner rental requests:', error);
      return;
    }
    this.rentalRequests = requests!;
  }
}