import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputFormComponent } from '../../shared/components/input-form/input-form.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, InputFormComponent, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  private route = inject(Router);

  onLogin() {
    console.log('Login attempt:', {
      username: this.username,
      password: this.password,
    });
    this.route.navigate(['/allEmployees']);
  }
}
