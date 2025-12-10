import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Get company ID from current session
   */
  getCompanyId(): string | null {
    if (!this.isBrowser) return null;

    const sessionId = sessionStorage.getItem('currentSessionId');
    if (!sessionId) return null;

    return sessionStorage.getItem(sessionId);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return this.getCompanyId() !== null;
  }

  /**
   * Clear current session (logout)
   */
  clearSession(): void {
    if (!this.isBrowser) return;

    const sessionId = sessionStorage.getItem('currentSessionId');
    if (sessionId) {
      sessionStorage.removeItem(sessionId);
      sessionStorage.removeItem('currentSessionId');
    }
  }
}
