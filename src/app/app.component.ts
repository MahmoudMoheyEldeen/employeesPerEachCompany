import { Component, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { SessionService } from './core/services/session.service';
import { filter } from 'rxjs/operators';

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
  sessionService = inject(SessionService);
  isLoggedIn = false;

  languages = [
    { label: 'English', value: 'en' },
    { label: 'عربي', value: 'ar' },
  ];

  selectedLanguage = { label: 'English', value: 'en' };

  ngOnInit() {
    // Check login status on init
    this.checkLoginStatus();

    // Check login status on every route change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.sessionService.isLoggedIn();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/WelcomePage']);
  }

  logout() {
    this.sessionService.clearSession();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  handleAuthButtonClick() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.navigateToLogin();
    }
  }
}
