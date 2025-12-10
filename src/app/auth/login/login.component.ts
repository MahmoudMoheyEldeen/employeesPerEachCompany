import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputFormComponent } from '../../shared/components/input-form/input-form.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpGeneralService } from '../../core/services/httpGeneralService.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputFormComponent,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  private router = inject(Router);
  private httpService = inject(HttpGeneralService);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: [
        'noureladawy418@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['123@123', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    // Check if form is valid
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    // API requires GET with query parameters (not ideal for security, but that's how the API is designed)
    const loginUrl = `https://erpapi.nc.sa/erp/Erp_Users/erp_login?email=${email}&password=${password}&lang=ar`;

    this.httpService.get<any>(loginUrl).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        // Check if login was successful based on result field
        if (response.result === false || response.result === 'false') {
          // Login failed - show error message
          this.errorMessage =
            response.errorMessage ||
            response.message ||
            'Invalid email or password';
          this.isLoading = false;
          console.error('Login failed:', this.errorMessage);
          return;
        }

        // Login successful
        console.log('Login successful:', response);

        // Generate unique session ID for this tab
        const sessionId = 'session_' + Date.now() + '_' + Math.random();

        // Store only companyId for this session
        sessionStorage.setItem(sessionId, response.companyId);

        // Store current session ID
        sessionStorage.setItem('currentSessionId', sessionId);

        this.isLoading = false;
        this.router.navigate(['/allEmployees']);
      },
      error: (error) => {
        console.error('HTTP Error:', error);
        this.errorMessage = error.message || 'Network error. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
