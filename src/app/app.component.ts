import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DropdownModule,
    ButtonModule,
    FormsModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'employeesPerEachCompany';
  router = inject(Router);

  languages = [
    { label: 'English', value: 'en' },
    { label: 'عربي', value: 'ar' },
  ];

  selectedLanguage = { label: 'English', value: 'en' };

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/WelcomePage']);
  }
}
