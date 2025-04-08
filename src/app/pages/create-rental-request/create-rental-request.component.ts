import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { CreateRentalRequestModel } from '../../models/create-rental-request-model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-rental-request',
  templateUrl: './create-rental-request.component.html',
  styleUrls: ['./create-rental-request.component.css']
})
export class CreateRentalRequestComponent implements OnInit {
  public rentalRequestData: CreateRentalRequestModel = new CreateRentalRequestModel('', '', 0);
  public errorMessage: string | null = null;
  private propertyId: string | null = null;
  private rentalService: RentalService;
  private router: Router;
  private route: ActivatedRoute;

  constructor(rentalService: RentalService, router: Router, route: ActivatedRoute) {
    this.rentalService = rentalService;
    this.router = router;
    this.route = route;
  }

  public ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('propertyId');
  }

  public async onSubmit(): Promise<void> {
    if (this.propertyId) {
      const [request, error] = await this.rentalService.createRentalRequest(this.rentalRequestData);
      if (error) {
        this.errorMessage = error;
        return;
      }
      this.router.navigate(['/rental-requests']);
    }
  }
}