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
import Swal from 'sweetalert2';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeCardComponent,
    AddButtonComponent,
    ReadMoreButtonComponent,
    SearchComponent,
    DropdownModule,
    FormsModule,
    TranslocoModule,
  ],
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss',
})
export class AllEmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  rawEmployeesData: any[] = []; // Store raw API data
  isLoading: boolean = false;
  errorMessage: string = '';
  pageSize: number = 8;
  currentPage: number = 0;
  hasMore: boolean = false;
  searchTerm: string = '';
  selectedStatus: string | null = null;

  statusOptions: any[] = [];

  private httpService = inject(HttpGeneralService);
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private translocoService = inject(TranslocoService);

  ngOnInit(): void {
    this.loadStatusOptions();
    this.loadEmployees();

    // Update status options and re-map employees when language changes
    this.translocoService.langChanges$.subscribe(() => {
      this.loadStatusOptions();
      this.remapEmployees();
    });
  }

  loadStatusOptions(): void {
    this.statusOptions = [
      { label: this.translocoService.translate('status.all'), value: null },
      {
        label: this.translocoService.translate('status.active'),
        value: 'Active Employee',
      },
      {
        label: this.translocoService.translate('status.probation'),
        value: 'Probation Period',
      },
      {
        label: this.translocoService.translate('status.terminated'),
        value: 'Terminated Employee',
      },
      {
        label: this.translocoService.translate('status.deceased'),
        value: 'Deceased Employee',
      },
    ];
  }

  mapEmployeeData(emp: any): Employee {
    const currentLang = this.translocoService.getActiveLang();
    const isArabic = currentLang === 'ar';

    return {
      id: emp.id,
      employeeId: emp.employeeId,
      fullName: isArabic
        ? emp.nameAr || emp.nameEn || 'N/A'
        : emp.nameEn || emp.nameAr || 'N/A',
      department: isArabic
        ? emp.department_name_ar || emp.department_name_en || 'N/A'
        : emp.department_name_en || emp.department_name_ar || 'N/A',
      hireDate: this.formatDate(emp.joining_date),
      status: isArabic
        ? emp.employment_status_name_ar ||
          emp.employment_status_name_en ||
          'N/A'
        : emp.employment_status_name_en ||
          emp.employment_status_name_ar ||
          'N/A',
      statusValue:
        emp.employment_status_name_en || emp.employment_status_name_ar || 'N/A', // Store original English value for filtering
      imageUrl: emp.emp_image,
      email: emp.email,
      job: emp.job,
      phone: emp.phone_no,
    };
  }

  remapEmployees(): void {
    if (this.rawEmployeesData.length > 0) {
      this.employees = this.rawEmployeesData.map((emp: any) =>
        this.mapEmployeeData(emp)
      );
      this.filteredEmployees = [...this.employees];
      this.resetPagination();
    }
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
          // Store raw API data
          this.rawEmployeesData = response;

          this.employees = response.map((emp: any) =>
            this.mapEmployeeData(emp)
          );

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
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.employees];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter((employee) => {
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

    // Apply status filter using statusValue (original API value)
    if (this.selectedStatus) {
      filtered = filtered.filter(
        (employee) => employee.statusValue === this.selectedStatus
      );
    }

    this.filteredEmployees = filtered;

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
    // Find the raw employee data by ID
    const rawEmployee = this.rawEmployeesData.find(
      (emp) => emp.id === employee.id
    );

    // Navigate to edit form with raw employee data as state
    this.router.navigate(['/add-edit-employee', employee.id], {
      state: { employee: rawEmployee || employee },
    });
  }

  onDeleteEmployee(employee: Employee): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${employee.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Add API call to delete employee
        console.log('Deleting employee:', employee);

        // Remove from local arrays
        this.employees = this.employees.filter((emp) => emp.id !== employee.id);
        this.filteredEmployees = this.filteredEmployees.filter(
          (emp) => emp.id !== employee.id
        );
        this.displayedEmployees = this.displayedEmployees.filter(
          (emp) => emp.id !== employee.id
        );

        // Update hasMore flag
        this.hasMore =
          this.currentPage * this.pageSize < this.filteredEmployees.length;

        // Show success message
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
      }
    });
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/add-edit-employee']);
  }
}
