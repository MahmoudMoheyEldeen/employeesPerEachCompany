import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EditButtonComponent } from '../../shared/components/edit-button/edit-button.component';
import { DeleteButtonComponent } from '../../shared/components/delete-button/delete-button.component';

interface Employee {
  id: number;
  fullName: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Suspended';
  imageUrl?: string;
  email?: string;
  phone?: string;
  position?: string;
  salary?: string;
  address?: string;
  manager?: string;
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

  employeeId: number = 0;
  employee: Employee | null = null;

  // Mock data - replace with actual service call
  mockEmployees: Employee[] = [
    {
      id: 1,
      fullName: 'Ahmed Mohamed',
      department: 'Engineering',
      hireDate: '2023-01-15',
      status: 'Active',
      email: 'ahmed.mohamed@company.com',
      phone: '+20 123 456 7890',
      position: 'Senior Software Engineer',
      salary: '$85,000',
      address: 'Cairo, Egypt',
      manager: 'John Smith',
    },
    {
      id: 2,
      fullName: 'Sara Ali',
      department: 'Marketing',
      hireDate: '2022-06-20',
      status: 'Active',
      email: 'sara.ali@company.com',
      phone: '+20 123 456 7891',
      position: 'Marketing Manager',
      salary: '$75,000',
      address: 'Alexandria, Egypt',
      manager: 'Jane Doe',
    },
    {
      id: 3,
      fullName: 'Omar Hassan',
      department: 'Sales',
      hireDate: '2023-03-10',
      status: 'Suspended',
      email: 'omar.hassan@company.com',
      phone: '+20 123 456 7892',
      position: 'Sales Representative',
      salary: '$60,000',
      address: 'Giza, Egypt',
      manager: 'Mike Johnson',
    },
    {
      id: 4,
      fullName: 'Fatima Ibrahim',
      department: 'HR',
      hireDate: '2021-11-05',
      status: 'Active',
      email: 'fatima.ibrahim@company.com',
      phone: '+20 123 456 7893',
      position: 'HR Specialist',
      salary: '$70,000',
      address: 'Cairo, Egypt',
      manager: 'Sarah Williams',
    },
    {
      id: 5,
      fullName: 'Khaled Mahmoud',
      department: 'Engineering',
      hireDate: '2023-07-22',
      status: 'Active',
      email: 'khaled.mahmoud@company.com',
      phone: '+20 123 456 7894',
      position: 'Frontend Developer',
      salary: '$65,000',
      address: 'Mansoura, Egypt',
      manager: 'John Smith',
    },
    {
      id: 6,
      fullName: 'Nour Youssef',
      department: 'Design',
      hireDate: '2022-09-18',
      status: 'Active',
      email: 'nour.youssef@company.com',
      phone: '+20 123 456 7895',
      position: 'UI/UX Designer',
      salary: '$72,000',
      address: 'Cairo, Egypt',
      manager: 'Emily Davis',
    },
  ];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.employeeId = +params['id'];
      this.loadEmployeeDetails();
    });
  }

  loadEmployeeDetails() {
    // Mock data - replace with actual API call
    this.employee =
      this.mockEmployees.find((emp) => emp.id === this.employeeId) || null;
  }

  getStatusClass(): string {
    return this.employee?.status === 'Active'
      ? 'bg-green-500/10 text-green-400 ring-green-500/20'
      : 'bg-red-500/10 text-red-400 ring-red-500/20';
  }

  goBack() {
    this.router.navigate(['/allEmployees']);
  }

  editEmployee() {
    console.log('Edit employee:', this.employee);
    // Add edit logic here
  }

  deleteEmployee() {
    console.log('Delete employee:', this.employee);
    // Add delete logic here
  }
}
