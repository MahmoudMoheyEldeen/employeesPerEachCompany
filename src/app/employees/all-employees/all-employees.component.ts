import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmployeeCardComponent,
  Employee,
} from '../../shared/components/employee-card/employee-card.component';
import { AddButtonComponent } from '../../shared/components/add-button/add-button.component';
import { ReadMoreButtonComponent } from '../../shared/components/read-more-button/read-more-button.component';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeCardComponent,
    AddButtonComponent,
    ReadMoreButtonComponent,
  ],
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss',
})
export class AllEmployeesComponent {
  employees: Employee[] = [
    {
      id: 1,
      fullName: 'Ahmed Mohamed',
      department: 'Engineering',
      hireDate: '2023-01-15',
      status: 'Active',
    },
    {
      id: 2,
      fullName: 'Sara Ali',
      department: 'Marketing',
      hireDate: '2022-06-20',
      status: 'Active',
    },
    {
      id: 3,
      fullName: 'Omar Hassan',
      department: 'Sales',
      hireDate: '2023-03-10',
      status: 'Suspended',
    },
    {
      id: 4,
      fullName: 'Fatima Ibrahim',
      department: 'HR',
      hireDate: '2021-11-05',
      status: 'Active',
    },
    // {
    //   id: 5,
    //   fullName: 'Khaled Mahmoud',
    //   department: 'Engineering',
    //   hireDate: '2023-07-22',
    //   status: 'Active',
    // },
    // {
    //   id: 6,
    //   fullName: 'Nour Youssef',
    //   department: 'Design',
    //   hireDate: '2022-09-18',
    //   status: 'Active',
    // },
  ];

  onEditEmployee(employee: Employee): void {
    console.log('Edit employee:', employee);
    // Add your edit logic here
  }

  onDeleteEmployee(employee: Employee): void {
    console.log('Delete employee:', employee);
    // Add your delete logic here
  }
}
