import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../iemployee';
import { EmployeeService } from '../employee.service';
import { FormsModule } from '@angular/forms';

type SortBy = keyof IEmployee;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: IEmployee[] = [];
  filteredEmployees: IEmployee[] = [];
  displayedEmployees: IEmployee[] = [];
  searchTerm: string = '';
  selectedJobTitle: string = '';
  sortBy: SortBy | '' = '';
  jobTitles: string[] = [];

  // Paginacija
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      this.filteredEmployees = [...data];
      this.jobTitles = [...new Set(data.map(employee => employee.jobTitle))];
      this.applyFilters(); // Primjenjujemo filtre i postavke paginacije
    });
  }

  searchEmployees() {
    this.applyFilters();
  }

  filterEmployees() {
    this.applyFilters();
  }

  sortEmployees() {
    this.applySort();
  }

  private applyFilters() {
    let filtered = [...this.employees];

    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(employee => 
        employee.firstName.toLowerCase().includes(searchTermLower) ||
        employee.lastName.toLowerCase().includes(searchTermLower)
      );
    }

    if (this.selectedJobTitle) {
      filtered = filtered.filter(employee => 
        employee.jobTitle === this.selectedJobTitle
      );
    }

    this.filteredEmployees = filtered;
    this.applySort();
  }

  private applySort() {
    if (this.sortBy) {
      this.filteredEmployees.sort((a, b) => {
        const valueA = a[this.sortBy as keyof IEmployee];
        const valueB = b[this.sortBy as keyof IEmployee];
        const stringValueA = valueA.toString().toLowerCase();
        const stringValueB = valueB.toString().toLowerCase();

        if (stringValueA < stringValueB) return -1;
        if (stringValueA > stringValueB) return 1;
        return 0;
      });
    }
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.setPage(this.currentPage); // Ažuriramo prikaz za trenutnu stranicu
  }

  private paginate() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate(); // Ažuriramo prikaz za novu stranicu
    }
  }
}
