import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { CreateRatingModel } from '../../models/CreateRatingModel';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../shared/menu/menu.component";
import { userRequests } from '../../app.routes';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, MenuComponent],
  templateUrl: './rating.component.html',
  providers: [MessageService]
})
export class RatingComponent implements OnInit {
  rating: number = 5;
  comments: string = '';
  requestId: string = '';
  loading: boolean = false;
  error: string | null = null;
  stars: number[] = [1, 2, 3, 4, 5];
  hoveredStar: number | null = null;

  constructor(
    private rentalService: RentalService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No request ID provided';
      return;
    }
    this.requestId = id;
  }

  setRating(value: number): void {
    this.rating = value;
  }

  setHoveredStar(star: number | null): void {
    this.hoveredStar = star;
  }

  isStarActive(star: number): boolean {
    return star <= (this.hoveredStar ?? this.rating);
  }

  async submitRating(): Promise<void> {
    if (this.loading) return;

    if (!this.comments.trim()) {
      this.error = 'Please provide a comment';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Comments are required'
      });
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      
      const ratingModel = new CreateRatingModel(this.rating, this.comments.trim());
      const [data, error] = await this.rentalService.createRating(this.requestId, ratingModel);

      if (error) {
        this.error = error;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Rating submitted successfully'
      });
      
      await this.router.navigate([userRequests]);
    } catch (err) {
      this.error = 'An unexpected error occurred while submitting your rating';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error
      });
    } finally {
      this.loading = false;
    }
  }
}

