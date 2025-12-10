import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

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
    TranslocoModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'employeesPerEachCompany';
  router = inject(Router);
  sessionService = inject(SessionService);
  translocoService = inject(TranslocoService);
  private platformId = inject(PLATFORM_ID);
  isLoggedIn = false;

  languages = [
    { label: 'English', value: 'en' },
    { label: 'عربي', value: 'ar' },
  ];

  selectedLanguage = { label: 'English', value: 'en' };

  ngOnInit() {
    // Check login status on init
    this.checkLoginStatus();

    // Set initial language (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang) {
        const lang = JSON.parse(savedLang);
        this.selectedLanguage = lang;
        this.translocoService.setActiveLang(lang.value);

        // Apply RTL/LTR direction
        this.applyDirection(lang.value);
      } else {
        // Default to LTR for English
        this.applyDirection('en');
      }
    }

    // Check login status on every route change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });
  }

  onLanguageChange() {
    this.translocoService.setActiveLang(this.selectedLanguage.value);

    // Save to localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'selectedLanguage',
        JSON.stringify(this.selectedLanguage)
      );
    }

    // Apply RTL/LTR direction
    this.applyDirection(this.selectedLanguage.value);
  }

  applyDirection(lang: string) {
    // Set document direction for RTL/LTR (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
      }
    }
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
  navigateToAllEmployees() {
    this.router.navigate(['/allEmployees']);
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
