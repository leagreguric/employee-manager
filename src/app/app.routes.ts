import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';

export const routes: Routes = [
    { path: '', component: EmployeeListComponent },
    { path: 'new', component: CreateEmployeeComponent },
    { path: '', redirectTo: '/employees', pathMatch: 'full' }
  ];
  