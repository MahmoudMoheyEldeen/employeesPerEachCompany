import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  observe?: 'body';
  responseType?: 'json';
  reportProgress?: boolean;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpGeneralService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(url, options).pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http
      .post<T>(url, body, options)
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http
      .put<T>(url, body, options)
      .pipe(catchError(this.handleError));
  }

  patch<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http
      .patch<T>(url, body, options)
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(url, options).pipe(catchError(this.handleError));
  }

  getWithParams<T>(
    url: string,
    params: { [key: string]: any },
    options?: HttpOptions
  ): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    const mergedOptions = { ...options, params: httpParams };
    return this.get<T>(url, mergedOptions);
  }

  postWithHeaders<T>(
    url: string,
    body: any,
    headers: { [key: string]: string }
  ): Observable<T> {
    const httpHeaders = new HttpHeaders(headers);
    return this.post<T>(url, body, { headers: httpHeaders });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error (${error.status}): ${error.message}`;

      switch (error.status) {
        case 400:
          errorMessage =
            'Bad Request: ' + (error.error?.message || 'Invalid request');
          break;
        case 401:
          errorMessage = 'Unauthorized: Please login again';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission';
          break;
        case 404:
          errorMessage = 'Not Found: Resource does not exist';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later';
          break;
        default:
          errorMessage = error.error?.message || errorMessage;
      }
    }

    console.error('HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}
