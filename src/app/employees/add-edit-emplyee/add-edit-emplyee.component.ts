import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-add-edit-emplyee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, TranslocoModule],
  templateUrl: './add-edit-emplyee.component.html',
  styleUrl: './add-edit-emplyee.component.scss',
})
export class AddEditEmplyeeComponent implements OnInit {
  employeeForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  employeeId: number | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      hireDate: ['', Validators.required],
      status: ['Active Employee', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;
      console.log('Form Data:', this.employeeForm.value);

      // TODO: Add API call here to save employee

      // Navigate back after save
      setTimeout(() => {
        this.isSubmitting = false;
        this.backToEmployees();
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.employeeForm.controls).forEach((key) => {
        this.employeeForm.get(key)?.markAsTouched();
      });
    }
  }

  checkEditMode(): void {
    // Get state from window.history (works after navigation)
    const state = window.history.state as { employee: any };

    // Check route params for ID
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];

        // If we have employee data in state, fill the form
        if (state?.employee) {
          this.fillForm(state.employee);
        }
      }
    });
  }

  fillForm(employee: any): void {
    // Map the API response fields to form fields
    this.employeeForm.patchValue({
      name: employee.nameEn || employee.nameAr || employee.fullName || '',
      department:
        employee.department_name_en ||
        employee.department_name_ar ||
        employee.department ||
        '',
      hireDate: this.convertDateToInputFormat(
        employee.joining_date || employee.hireDate
      ),
      status:
        employee.employment_status_name_en ||
        employee.employment_status_name_ar ||
        employee.status ||
        'Active Employee',
    });
  }

  convertDateToInputFormat(dateString: string): string {
    if (!dateString) return '';

    // Handle ISO date format (2025-10-01T00:00:00)
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // If date is in dd-mm-yyyy format, convert to yyyy-mm-dd
    const parts = dateString.split('-');
    if (parts.length === 3 && parts[0].length <= 2) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }

    return dateString;
  }

  backToEmployees(): void {
    this.router.navigate(['/allEmployees']);
  }

  // Helper methods for validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    if (field?.hasError('minlength')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } must be at least 3 characters`;
    }
    return '';
  }
}
