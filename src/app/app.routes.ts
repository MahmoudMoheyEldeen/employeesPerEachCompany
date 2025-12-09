import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AllEmployeesComponent } from './employees/all-employees/all-employees.component';
import { EmployeeDetailsComponent } from './employees/employee-details/employee-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'WelcomePage',
    pathMatch: 'full',
  },
  {
    path: 'WelcomePage',
    component: WelcomePageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'allEmployees',
    component: AllEmployeesComponent,
  },
  {
    path: 'employee-Details/:id',
    component: EmployeeDetailsComponent,
  },
  {
    path: 'employee-Details',
    component: EmployeeDetailsComponent,
  },
];
