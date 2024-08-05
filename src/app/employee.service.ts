import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IEmployee } from './iemployee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseURL = 'https://api.test.ulaznice.hr/paganini/api/job-interview/employees';

  constructor(private httpClient: HttpClient) {}

  getEmployees(): Observable<IEmployee[]> {
    return this.httpClient.get<{ success: boolean; data: IEmployee[] }>(this.baseURL).pipe(
      map(response => {
        if (response.success) {
          console.log('Server response:', response);
          return response.data; // Vraća niz zaposlenih
        } else {
          throw new Error('API returned an unsuccessful response');
        }
      }),
      catchError(this.handleError)
    );
  }

  createEmployee(employee: Omit<IEmployee, 'id'>): Observable<Object> {
    return this.httpClient.post(this.baseURL, employee, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    }).pipe(
      map(response => {
        console.log('Server response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getEmployee(id: number): Observable<IEmployee> {
    return this.httpClient.get<{ success: boolean; data: IEmployee }>(`${this.baseURL}/${id}`).pipe(
      map(response => {
        if (response.success) {
          console.log('Server response:', response);
          return response.data; // Vraća pojedinačnog zaposlenog
        } else {
          throw new Error('API returned an unsuccessful response');
        }
      }),
      catchError(this.handleError)
    );
  }

  updateEmployee(id: number, employee: Omit<IEmployee, 'id'>): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/${id}`, employee, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    }).pipe(
      map(response => {
        console.log('Server response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  deleteEmployee(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/${id}`, { responseType: 'json' }).pipe(
      map(response => {
        console.log('Server response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
