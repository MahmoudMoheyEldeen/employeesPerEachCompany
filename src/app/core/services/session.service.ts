import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  /**
   * Get company ID from current session
   */
  getCompanyId(): string | null {
    const sessionId = sessionStorage.getItem('currentSessionId');
    if (!sessionId) return null;

    return sessionStorage.getItem(sessionId);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.getCompanyId() !== null;
  }

  /**
   * Clear current session (logout)
   */
  clearSession(): void {
    const sessionId = sessionStorage.getItem('currentSessionId');
    if (sessionId) {
      sessionStorage.removeItem(sessionId);
      sessionStorage.removeItem('currentSessionId');
    }
  }
}
