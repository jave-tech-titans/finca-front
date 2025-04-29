import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from "../shared/menu/menu.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateRentalRequestModel } from '../../models/CreateRentalRequestModel';
import { RentalRequestModel } from '../../models/RentalRequestModel';
import { PropertyModel } from '../../models/PropertyModel';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../services/properties.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { RentalService } from '../../services/rental.service';

import { ScheduleModel } from '../../models/ScheduleModel';
import { format } from 'date-fns';
import { DropdownModule } from 'primeng/dropdown';
import { homepageRoute } from '../../app.routes';
import { BottomComponent } from "../shared/bottom/bottom.component";


@Component({
  selector: 'app-request-rent',
  imports: [ToastModule, MenuComponent, CommonModule, FormsModule, ReactiveFormsModule, InputNumberModule, CalendarModule, DropdownModule, BottomComponent],
  templateUrl: './request-rent.component.html',
  styleUrl: './request-rent.component.css',
  providers: [MessageService]
})
export class RequestRentComponent {
  rentRequestForm = new FormGroup({
    dateStart: new FormControl(''),
    dateEnd: new FormControl(''),
    numPeople: new FormControl(''),
  });

  rentRequest: CreateRentalRequestModel = {} as CreateRentalRequestModel;
  property: PropertyModel = {} as PropertyModel;

  schedulesByMonth: Record<string, ScheduleModel[]> = {};
  selectedYear = new Date().getFullYear();
  selectedMonth: number | null = null;

  availableYears: number[] = [];
  availableMonths = [
    { label: 'All', value: null },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: format(new Date(0, i), 'MMMM'),
      value: i
    }))
  ];

  constructor(
    private route: ActivatedRoute,
    private propsService: PropertiesService,
    private rentService: RentalService,
    private messageService: MessageService, 
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadPropertyDetail();
    this.availableYears = [this.selectedYear - 1, this.selectedYear, this.selectedYear + 1];
  }

  async loadPropertyDetail() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const [prop, err] = await this.propsService.getFullProperty(id);
    if (prop) {
      this.property = prop;
      this.loadSchedules(); 
    }
  }

  async loadSchedules() {
    if (!this.property?.id) return;
    const [schedules, err] = await this.rentService.getPropertySchedules(
      this.property.id,
      this.selectedYear,
      this.selectedMonth ?? -1
    );

    if (schedules) {
      this.schedulesByMonth = this.groupSchedulesByMonth(schedules);
    }
  }

  groupSchedulesByMonth(schedules: ScheduleModel[]): Record<string, ScheduleModel[]> {
    const grouped: Record<string, ScheduleModel[]> = {};
    schedules.forEach(s => {
      const date = new Date(s.startDate);
      const key = format(date, 'MMMM');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(s);
    });
    return grouped;
  }

  onFilterChange() {
    this.loadSchedules();
  }

  async requestRent(){
    const dateStartControl = this.rentRequestForm.get('dateStart');
    const dateEndControl = this.rentRequestForm.get('dateEnd');
    const numPeopleControl = this.rentRequestForm.get('numPeople');

    const dateStart = dateStartControl && dateStartControl.value
        ? new Date(dateStartControl.value).toISOString().slice(0, 10) : null;
    const dateEnd = dateEndControl && dateEndControl.value
        ? new Date(dateEndControl.value).toISOString().slice(0, 10) : null;
    const numPeople = numPeopleControl && numPeopleControl.value ? +numPeopleControl.value : 0;

    const now = new Date();

    if (!dateStart || !dateEnd || !numPeople) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes llenar todos los campos',
        life: 4000
      })
      return
    }

    if (numPeople <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe haber al menos 1 persona',
        life: 4000
      })
      return
    }

    this.rentRequest = new CreateRentalRequestModel(
      dateStart,
      dateEnd,
      numPeople
    );

    this.messageService.add({
      severity: 'warn',
      summary: 'Procesando',
      detail: 'Estamos pidiendo la renta',
      life: 1000
    })

    const [ok, error] = await this.rentService.createRentalRequest(this.property.id ,this.rentRequest)
    if(error){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 4000
      })
      return
    }else{
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Peticion creada',
        life: 4000
      })
    }
    await new Promise(f => setTimeout(f, 2000));
    this.router.navigate([`/${homepageRoute}`])
  }

  calculatePrice(): string {
    const start = this.rentRequestForm.get('dateStart')?.value;
    const end = this.rentRequestForm.get('dateEnd')?.value;
    if (!start || !end) return '';
    const nights = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return `$${nights * (this.property?.nightPrice ?? 0)}`;
  }

  get scheduleMonths(): string[] {
    return Object.keys(this.schedulesByMonth);
  }
  
}
