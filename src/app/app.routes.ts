import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PropertiesListComponent } from './pages/shared/properties-list/properties-list.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchPropertiesComponent } from './pages/search-properties/search-properties.component';
import { RentPropertyComponent } from './pages/rent-property/rent-property.component';
import { RequestRentComponent } from './pages/request-rent/request-rent.component';

export const loginRoute = "login"
export const registerRoute = "register"
export const homepageRoute = "home"


//only landlord routes
export const myPropertiesRoute = "my-properties"
export const ownerRentalRequests = "owner-rental-requests"

//only client routes
export const propertiesRoute = "properties"
export const rentPropertyRoute = "rent/properties"
export const requestRentRoute = "rental-requests/properties"



export const routes: Routes = [
    {path: loginRoute, component: LoginComponent},
    {path: registerRoute, component: RegisterComponent},
    {path: homepageRoute, component: HomeComponent},
    {path: propertiesRoute, component: SearchPropertiesComponent},
    {path: `${rentPropertyRoute}/:id`, component: RentPropertyComponent},
    {path: `${requestRentRoute}/:id`, component: RequestRentComponent},


    
    {path: '**', component: LoginComponent}
];
