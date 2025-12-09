import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DeleteButtonComponent } from '../delete-button/delete-button.component';
import { AddButtonComponent } from '../add-button/add-button.component';
import { EditButtonComponent } from '../edit-button/edit-button.component';
import { Router } from '@angular/router';

export interface Employee {
  id: number;
  fullName: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Suspended';
  imageUrl?: string;
}

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DeleteButtonComponent,
    EditButtonComponent,
  ],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss',
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() onEdit = new EventEmitter<Employee>();
  @Output() onDelete = new EventEmitter<Employee>();

  private router = inject(Router);

  getStatusClass(): string {
    return this.employee.status === 'Active'
      ? 'bg-green-500/10 text-green-400 ring-green-500/20'
      : 'bg-red-500/10 text-red-400 ring-red-500/20';
  }

  editEmployee(): void {
    this.onEdit.emit(this.employee);
  }

  deleteEmployee(): void {
    this.onDelete.emit(this.employee);
  }
  navigateToEmployeeDetails() {
    this.router.navigate(['/employee-Details', this.employee.id]);
  }
}
