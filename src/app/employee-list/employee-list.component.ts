import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../iemployee';
import { EmployeeService } from '../employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type SortBy = keyof IEmployee;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule, CommonModule,MatIconModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees: IEmployee[] = [];
  filteredEmployees: IEmployee[] = [];
  displayedEmployees: IEmployee[] = [];
  searchTerm: string = '';
  selectedJobTitle: string = '';
  sortBy: SortBy | '' = '';
  jobTitles: string[] = [];
  jobTitleColors: { [key: string]: string } = {};
  private colorPalette: string[] = ['#FDD8D2', '#FDEBC9', '#CAD3E5', '#DAF8E1', '#E7C2EF', '#00BCD4', '#FFC107', '#8BC34A'];

  // Paginacija
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      this.jobTitles = [...new Set(data.map(employee => employee.jobTitle))];
      this.assignColorsToJobTitles();
      this.applyFilters();
    });
  }

  assignColorsToJobTitles() {
    this.jobTitles.forEach((jobTitle, index) => {
      this.jobTitleColors[jobTitle] = this.colorPalette[index % this.colorPalette.length];
    });
  }

  searchEmployees() {
    this.currentPage = 1;
    this.applyFilters();
  }

  filterEmployees() {
    this.currentPage = 1;
    this.applyFilters();
  }

  sortEmployees() {
    this.applySort();
  }

  private applyFilters() {
    let filtered = [...this.employees];

    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(employee =>
        employee.firstName.toLowerCase() === searchTermLower ||
        employee.lastName.toLowerCase() === searchTermLower
      );
    }

    if (this.selectedJobTitle) {
      filtered = filtered.filter(employee =>
        employee.jobTitle === this.selectedJobTitle
      );
    }

    this.filteredEmployees = filtered;
    this.updatePagination();
  }

  private applySort() {
    if (this.sortBy) {
      this.filteredEmployees.sort((a, b) => {
        const valueA = a[this.sortBy as keyof IEmployee];
        const valueB = b[this.sortBy as keyof IEmployee];

        if (this.sortBy === 'dateOfBirth') {
          const dateA = new Date(valueA as string);
          const dateB = new Date(valueB as string);
          return dateA.getTime() - dateB.getTime();
        } else {
          const stringValueA = valueA.toString().toLowerCase();
          const stringValueB = valueB.toString().toLowerCase();

          if (stringValueA < stringValueB) return -1;
          if (stringValueA > stringValueB) return 1;
          return 0;
        }
      });
    }
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.paginate();
  }

  private paginate() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  trackByFn(index: number, item: IEmployee): number {
    return item.id;
  }

  getJobTitleColor(jobTitle: string): string {
    return this.jobTitleColors[jobTitle] || '#000000';
  }
}
