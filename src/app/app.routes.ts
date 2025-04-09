import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PropertiesListComponent } from './pages/properties-list/properties-list.component';

export const loginRoute = "login"
export const registerRoute = "register"
export const mainPageRoute = "main"
export const propertiesRoute = "properties"



export const routes: Routes = [
    {path: loginRoute, component: LoginComponent},
    {path: registerRoute, component: RegisterComponent},
    {path: mainPageRoute, component: MainPageComponent},
    {path: propertiesRoute, component: PropertiesListComponent},


    
    {path: '**', component: LoginComponent}
];
