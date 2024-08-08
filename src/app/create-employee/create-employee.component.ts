import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IEmployee } from '../iemployee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss',
})
export class CreateEmployeeComponent {
  createEmployeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    jobTitle: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', Validators.required)
});

  isLoading = false;
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  

  goToHomePage() {
    return this.router.navigate(['/employees']);
  }

  saveEmployee() {
    this.isLoading = true; // Postavljanje stanja učitavanja na true
    this.employeeService.createEmployee(this.createEmployeeForm.value as IEmployee).subscribe(
        (data) => {
            this.isLoading = false;
            console.log(data);
            this.goToHomePage();
        },
        (error) => {
            this.isLoading = false;
            console.log(error);
        }
    );
}

handleSubmit() {
  if (this.createEmployeeForm.valid) {
    console.log('Form Data:', this.createEmployeeForm.value);
  } else {
    console.log('Form is invalid');
  }
}


}
