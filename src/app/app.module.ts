// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { BASE_URL } from './tokens';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    PropertyListComponent,
    PropertyCreateComponent,
    RentalRequestComponent,
    PropertyDetailComponent,
    PropertyUpdateComponent,
    CreateRentalRequestComponent,
    OwnerRentalRequestComponent,
    PaymentComponent,
    RatingComponent,
    ScheduleComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: BASE_URL, useValue: 'http://localhost:8080/api' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}