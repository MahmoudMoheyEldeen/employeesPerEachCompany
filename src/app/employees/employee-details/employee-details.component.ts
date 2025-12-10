import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EditButtonComponent } from '../../shared/components/edit-button/edit-button.component';
import { DeleteButtonComponent } from '../../shared/components/delete-button/delete-button.component';
import { HttpGeneralService } from '../../core/services/httpGeneralService.service';
import { SessionService } from '../../core/services/session.service';
import Swal from 'sweetalert2';

interface Employee {
  id: number;
  employeeId: number;
  fullName: string;
  department: string;
  hireDate: string;
  status: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  job?: string;
  address?: string;
  manager?: string;
  nationality?: string;
  nationalId?: string;
  birthdate?: string;
  gender?: string;
  maritalStatus?: string;
  role?: string;
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    EditButtonComponent,
    DeleteButtonComponent,
  ],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
})
export class EmployeeDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private httpService = inject(HttpGeneralService);
  private sessionService = inject(SessionService);

  employeeId: number = 0;
  employee: Employee | null = null;
  rawEmployeeData: any = null; // Store raw API data for edit
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.employeeId = +params['id'];
      this.loadEmployeeDetails();
    });
  }

  loadEmployeeDetails() {
    const companyId = this.sessionService.getCompanyId();

    if (!companyId) {
      this.errorMessage = 'Please login first';
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const apiUrl = `https://erpapi.nc.sa/erp/Mangement/get_all_erp_employees_by_company_id?company_id=${companyId}`;

    this.httpService.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          const employeeData = response.find(
            (emp: any) => emp.id === this.employeeId
          );

          if (employeeData) {
            // Store raw data for edit functionality
            this.rawEmployeeData = employeeData;

            this.employee = {
              id: employeeData.id,
              employeeId: employeeData.employeeId,
              fullName: employeeData.nameEn || employeeData.nameAr || 'N/A',
              department:
                employeeData.department_name_en ||
                employeeData.department_name_ar ||
                'N/A',
              hireDate: this.formatDate(employeeData.joining_date),
              status:
                employeeData.employment_status_name_en ||
                employeeData.employment_status_name_ar ||
                'N/A',
              imageUrl: employeeData.emp_image,
              email: employeeData.email || 'N/A',
              phone: employeeData.phone_no || 'N/A',
              job: employeeData.job || 'N/A',
              address: employeeData.address || 'N/A',
              manager:
                employeeData.direct_manager_name_en ||
                employeeData.direct_manager_name_ar ||
                'N/A',
              nationality: employeeData.nationality || 'N/A',
              nationalId: employeeData.national_id || 'N/A',
              birthdate: this.formatDate(employeeData.birthdate),
              gender:
                employeeData.gender_name_en ||
                employeeData.gender_name_ar ||
                'N/A',
              maritalStatus:
                employeeData.marital_status_name_en ||
                employeeData.marital_status_name_ar ||
                'N/A',
              role: employeeData.roleNameEn || employeeData.roleNameAr || 'N/A',
            };
          } else {
            this.employee = null;
            this.errorMessage = 'Employee not found';
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load employee details:', error);
        this.errorMessage = 'Failed to load employee details';
        this.isLoading = false;
      },
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  getStatusClass(): string {
    const status = this.employee?.status?.toLowerCase() || '';
    if (status.includes('active') || status.includes('نشط')) {
      return 'bg-green-500/10 text-green-400 ring-green-500/20';
    }
    return 'bg-red-500/10 text-red-400 ring-red-500/20';
  }

  goBack() {
    this.router.navigate(['/allEmployees']);
  }

  editEmployee(event: Event) {
    event.stopPropagation();

    if (!this.employee) return;

    // Navigate to edit form with raw employee data
    this.router.navigate(['/add-edit-employee', this.employee.id], {
      state: { employee: this.rawEmployeeData },
    });
  }

  deleteEmployee(event: Event) {
    event.stopPropagation();

    if (!this.employee) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${this.employee.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Add API call to delete employee
        console.log('Deleting employee:', this.employee);

        // Show success message and navigate back
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success').then(
          () => {
            this.router.navigate(['/allEmployees']);
          }
        );
      }
    });
  }
}
