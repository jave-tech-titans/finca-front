// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyCreateComponent } from './components/property-create/property-create.component';
import { RentalRequestComponent } from './components/rental-request/rental-request.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { PropertyUpdateComponent } from './components/property-update/property-update.component';
import { CreateRentalRequestComponent } from './components/create-rental-request/create-rental-request.component';
import { OwnerRentalRequestComponent } from './components/owner-rental-request/owner-rental-request.component';
import { PaymentComponent } from './components/payment/payment.component';
import { RatingComponent } from './components/rating/rating.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'properties', component: PropertyListComponent },
  { path: 'properties/create', component: PropertyCreateComponent },
  { path: 'properties/:id', component: PropertyDetailComponent },
  { path: 'properties/:id/update', component: PropertyUpdateComponent },
  { path: 'rental-requests', component: RentalRequestComponent },
  { path: 'rental-request/create/:propertyId', component: CreateRentalRequestComponent },
  { path: 'owner-rental-requests', component: OwnerRentalRequestComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'rating', component: RatingComponent },
  { path: 'schedule', component: ScheduleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}