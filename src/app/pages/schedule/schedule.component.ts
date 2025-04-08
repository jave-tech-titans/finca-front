import { Component } from '@angular/core';
import { ScheduleModel } from '../../models/schedule-model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  public scheduleData: ScheduleModel = new ScheduleModel('', '');
  public errorMessage: string | null = null;

  // Aquí podrías inyectar un servicio para manejar programaciones si el backend lo soporta
  public onSubmit(): void {
    // Lógica para manejar la programación (por ejemplo, enviar al backend)
    console.log('Schedule submitted:', this.scheduleData);
  }
}