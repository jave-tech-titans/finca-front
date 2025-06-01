import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MenuComponent } from "../shared/menu/menu.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-request-rent',
  standalone: true,
  imports: [ToastModule, MenuComponent, CommonModule, FormsModule, ReactiveFormsModule, InputNumberModule, CalendarModule, DropdownModule],
  templateUrl: './request-rent.component.html',
  providers: [MessageService]
})
export class RequestRentComponent {
  loading = {
    property: false,
    schedules: false,
    submission: false
  };

  error = {
    property: null as string | null,
    schedules: null as string | null,
    submission: null as string | null
  };

  rentRequestForm = new FormGroup({
    dateStart: new FormControl('', [Validators.required]),
    dateEnd: new FormControl('', [Validators.required]),
    numPeople: new FormControl('', [Validators.required, Validators.min(1)]),
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
    try {
      this.loading.property = true;
      this.error.property = null;
      
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.error.property = 'No property ID provided';
        return;
      }

      const [prop, err] = await this.propsService.getFullProperty(id);
      if (err) {
        this.error.property = err;
        return;
      }

      if (prop) {
        this.property = prop;
        await this.loadSchedules();
      }
    } catch (error) {
      this.error.property = 'An unexpected error occurred while loading the property';
    } finally {
      this.loading.property = false;
    }
  }

  async loadSchedules() {
    try {
      if (!this.property?.id) return;
      
      this.loading.schedules = true;
      this.error.schedules = null;

      const [schedules, err] = await this.rentService.getPropertySchedules(
        this.property.id,
        this.selectedYear,
        this.selectedMonth ?? -1
      );

      if (err) {
        this.error.schedules = err;
        return;
      }

      if (schedules) {
        this.schedulesByMonth = this.groupSchedulesByMonth(schedules);
      }
    } catch (error) {
      this.error.schedules = 'An unexpected error occurred while loading schedules';
    } finally {
      this.loading.schedules = false;
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

  async requestRent() {
    if (this.loading.submission) return;

    try {
      if (this.rentRequestForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill in all required fields correctly',
          life: 4000
        });
        return;
      }

      const dateStart = this.rentRequestForm.get('dateStart')?.value;
      const dateEnd = this.rentRequestForm.get('dateEnd')?.value;
      const numPeople = this.rentRequestForm.get('numPeople')?.value;

      if (!dateStart || !dateEnd || !numPeople) {
        this.error.submission = 'All fields are required';
        return;
      }

      const startDate = new Date(dateStart).toISOString().slice(0, 10);
      const endDate = new Date(dateEnd).toISOString().slice(0, 10);
      const guests = +numPeople;

      if (guests <= 0) {
        this.error.submission = 'At least one guest is required';
        return;
      }

      this.loading.submission = true;
      this.error.submission = null;

      this.messageService.add({
        severity: 'info',
        summary: 'Processing',
        detail: 'Submitting your rental request...',
        life: 1000
      });

      const rentRequest = new CreateRentalRequestModel(startDate, endDate, guests);
      const [ok, error] = await this.rentService.createRentalRequest(this.property.id, rentRequest);

      if (error) {
        this.error.submission = error;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 4000
        });
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Rental request created successfully',
        life: 4000
      });

      await new Promise(f => setTimeout(f, 2000));
      await this.router.navigate([`/${homepageRoute}`]);
    } catch (error) {
      this.error.submission = 'An unexpected error occurred while submitting your request';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.error.submission,
        life: 4000
      });
    } finally {
      this.loading.submission = false;
    }
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
