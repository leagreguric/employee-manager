import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EmployeeService } from './employee.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule,
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  providers: [EmployeeService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Employee Manager';
  links = [
    { path: '', text: 'Employees', icon: 'people' },
    { path: '/new', text: 'Create', icon: 'add_circle' },
  ];
}
