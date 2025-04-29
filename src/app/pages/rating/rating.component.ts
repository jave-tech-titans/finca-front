import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { CreateRatingModel } from '../../models/CreateRatingModel';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from "../shared/menu/menu.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating',
  imports: [ToastModule, ButtonModule, MenuComponent],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  providers: [MessageService]
})
export class RatingComponent implements OnInit {

  ratingValue: number = 5;
  comments: string = '';
  requestId: string = '';
  loading: boolean = false;

  constructor(
    private rentalService: RentalService,  // Usamos RentalService
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id') ?? '';  // Obtener el ID de la URL
  }

  submitRating() {
    this.createRating();
  }
  
  

  async createRating() {
    // Validación de los campos
    if (!this.comments.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Los comentarios son obligatorios.' });
      return;
    }

    // Crear el modelo de rating con la calificación y comentarios
    const ratingModel = new CreateRatingModel(this.ratingValue, this.comments);

    // Llamada al servicio para crear el rating
    this.loading = true;
    const [data, error] = await this.rentalService.createRating(this.requestId, ratingModel);  // Usamos el servicio

    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      this.loading = false;
    } else {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rating creado exitosamente.' });
      this.router.navigate(['/property', this.requestId]);  // Redirigir a la página de la propiedad
    }
  }
}
