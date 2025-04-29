import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { CreateRatingModel } from '../../models/CreateRatingModel';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MenuComponent } from "../shared/menu/menu.component";


@Component({
  selector: 'app-rating',
  imports: [CardModule, FloatLabelModule, ToastModule, ButtonModule, FormsModule, IftaLabelModule ],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  providers: [MessageService]
})
export class RatingComponent implements OnInit {

  rating: number = 5;    // Valor inicial para la calificación
  comments: string = '';      // Comentarios iniciales
  requestId: string = '';     // ID del alquiler
  loading: boolean = false;  // Indicador de carga para deshabilitar el botón de envío

  constructor(
    private rentalService: RentalService,  // Servicio para interactuar con la API
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Obtén el ID de la propiedad desde la URL
    this.requestId = this.route.snapshot.paramMap.get('id') ?? '';  // Obtener el ID de la URL
  }

  submitRating() {
    // Validación antes de enviar (como en tu caso del registro)
    if (!this.comments.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Los comentarios son obligatorios.' });
      return;
    }

    // Crear el modelo de rating con la calificación y los comentarios
    const ratingModel = new CreateRatingModel(Number(this.rating), this.comments);

    // Llamada al servicio para crear el rating
    this.loading = true;
    this.rentalService.createRating(this.requestId, ratingModel)
      .then(([data, error]) => {
        if (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
          this.loading = false;
        } else {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rating creado exitosamente.' });
          this.router.navigate(['/property', this.requestId]);  // Redirigir a la página de la propiedad
        }
      })
      .catch(err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al crear la calificación.' });
        this.loading = false;
      });
  }
}

