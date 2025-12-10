import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmployeeCardComponent,
  Employee,
} from '../../shared/components/employee-card/employee-card.component';
import { AddButtonComponent } from '../../shared/components/add-button/add-button.component';
import { ReadMoreButtonComponent } from '../../shared/components/read-more-button/read-more-button.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { HttpGeneralService } from '../../core/services/httpGeneralService.service';
import { SessionService } from '../../core/services/session.service';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeCardComponent,
    AddButtonComponent,
    ReadMoreButtonComponent,
    SearchComponent,
  ],
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss',
})
export class AllEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  pageSize: number = 8;
  currentPage: number = 0;
  hasMore: boolean = false;
  searchTerm: string = '';

  private httpService = inject(HttpGeneralService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    // Get company ID from session
    const companyId = this.sessionService.getCompanyId();

    if (!companyId) {
      console.error('No company ID found in session');
      this.errorMessage = 'Please login first';
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const apiUrl = `https://erpapi.nc.sa/erp/Mangement/get_all_erp_employees_by_company_id?company_id=${companyId}`;

    this.httpService.get<any>(apiUrl).subscribe({
      next: (response) => {
        console.log('Employees API Response:', response);

        // Map API response to Employee interface
        if (response && Array.isArray(response)) {
          this.employees = response.map((emp: any) => ({
            id: emp.id,
            employeeId: emp.employeeId,
            fullName: emp.nameEn || emp.nameAr || 'N/A',
            department:
              emp.department_name_en || emp.department_name_ar || 'N/A',
            hireDate: this.formatDate(emp.joining_date),
            status:
              emp.employment_status_name_en ||
              emp.employment_status_name_ar ||
              'N/A',
            imageUrl: emp.emp_image,
            email: emp.email,
            job: emp.job,
            phone: emp.phone_no,
          }));

          // Initialize filtered employees with all employees
          this.filteredEmployees = [...this.employees];

          // Load first 8 employees
          this.resetPagination();
        } else {
          this.employees = [];
          this.filteredEmployees = [];
          this.displayedEmployees = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load employees:', error);
        this.errorMessage = 'Failed to load employees. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadMoreEmployees(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newEmployees = this.filteredEmployees.slice(startIndex, endIndex);

    this.displayedEmployees = [...this.displayedEmployees, ...newEmployees];
    this.currentPage++;
    this.hasMore = endIndex < this.filteredEmployees.length;
  }

  resetPagination(): void {
    this.currentPage = 0;
    this.displayedEmployees = [];
    this.loadMoreEmployees();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();

    if (!this.searchTerm) {
      // No search term - show all employees
      this.filteredEmployees = [...this.employees];
    } else {
      // Filter employees by all fields
      this.filteredEmployees = this.employees.filter((employee) => {
        const fullName = employee.fullName?.toLowerCase() || '';
        const department = employee.department?.toLowerCase() || '';
        const hireDate = employee.hireDate?.toLowerCase() || '';
        const status = employee.status?.toLowerCase() || '';

        return (
          fullName.includes(this.searchTerm) ||
          department.includes(this.searchTerm) ||
          hireDate.includes(this.searchTerm) ||
          status.includes(this.searchTerm)
        );
      });
    }

    // Reset pagination and load first page of filtered results
    this.resetPagination();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-4);

    return `${day}-${month}-${year}`;
  }

  onEditEmployee(employee: Employee): void {
    console.log('Edit employee:', employee);
    // Add your edit logic here
  }

  onDeleteEmployee(employee: Employee): void {
    console.log('Delete employee:', employee);
    // Add your delete logic here
  }
}
