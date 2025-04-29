import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PropertiesListComponent } from './pages/shared/properties-list/properties-list.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchPropertiesComponent } from './pages/search-properties/search-properties.component';
import { RentPropertyComponent } from './pages/rent-property/rent-property.component';
import { RequestRentComponent } from './pages/request-rent/request-rent.component';
import { OwnerRequestsComponent } from './pages/owner-requests/owner-requests.component';
import { UserRequestsComponent } from './pages/user-requests/user-requests.component';
import { BankInformationComponent } from './pages/bank-information/bank-information.component';
import { ConfirmAccComponent } from './pages/confirm-acc/confirm-acc.component';
import { PropertyManagerComponent } from './pages/property-manager/propertymanager.component';
import { RatingComponent } from './pages/rating/rating.component';

export const loginRoute = 'login';
export const registerRoute = 'register';
export const homepageRoute = 'home';
export const confirm = "auth/confirmation"

//only landlord routes
export const myPropertiesRoute = 'my-properties';
export const ownerRequests = 'ownerrequests';
export const managePropertyRoute = "manage-property";

//only client routes
export const userRequests = 'userrequests';
export const propertiesRoute = 'properties';
export const rentPropertyRoute = 'rent/properties';
export const requestRentRoute = 'rental-requests/properties';
export const ratingRoute = "rating"; 

export const routes: Routes = [
  { path: loginRoute, component: LoginComponent },
  { path: registerRoute, component: RegisterComponent },
  { path: homepageRoute, component: HomeComponent },
  { path: propertiesRoute, component: SearchPropertiesComponent },
  { path: `${rentPropertyRoute}/:id`, component: RentPropertyComponent },
  { path: `${requestRentRoute}/:id`, component: RequestRentComponent },
  { path: ownerRequests, component: OwnerRequestsComponent },
  { path: userRequests, component: UserRequestsComponent },
  {path: 'rental-requests/:requestId/payment', component: BankInformationComponent },
  {path:`${confirm}/:token`, component:ConfirmAccComponent },
  {path: `${managePropertyRoute}/:id`, component: PropertyManagerComponent },
  { path: `${ratingRoute}/:id`, component: RatingComponent },
  { path: '**', component: LoginComponent },

]