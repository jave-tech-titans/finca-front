import { Component } from '@angular/core';
import { RatingService } from '../../services/rating.service';
import { CreateRatingModel } from '../../models/create-rating-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  public ratingData: CreateRatingModel = new CreateRatingModel(0, '');
  public errorMessage: string | null = null;
  private ratingService: RatingService;
  private router: Router;

  constructor(ratingService: RatingService, router: Router) {
    this.ratingService = ratingService;
    this.router = router;
  }

  public async onSubmit(): Promise<void> {
    const [success, error] = await this.ratingService.createRating(this.ratingData);
    if (error) {
      this.errorMessage = error;
      return;
    }
    this.router.navigate(['/properties']);
  }
}