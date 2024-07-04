import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://57.152.32.19:8443/users/login'; // Login URL
  private registerUrl = 'https://57.152.32.19:8443/users/create'; // Register URL
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getTokenFromCookies());

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getTokenFromCookies(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const name = 'authToken=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
    }
    return null;
  }

  private setTokenToCookies(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `authToken=${token};path=/;SameSite=None;Secure`;
    }
  }

  private clearTokenFromCookies(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = 'authToken=; Max-Age=0; path=/; SameSite=None; Secure';
    }
  }

  login(userName: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json'
    });
    const encryptedPassword = CryptoJS.MD5(password).toString().toUpperCase();
    const body = {
      traceID: 'string',
      token: 'string',
      userID: 0,
      userName,
      password: encryptedPassword,
      code: 'string',
      ua: 'string'
    };

    return this.http.post<any>(this.loginUrl, body, { headers, withCredentials: true  })
      .pipe(
        tap(response => {
          if (response.token) {
            this.tokenSubject.next(response.token);
            this.setTokenToCookies(response.token);
          } else if (response.message) {
            throw new Error(response.message);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  register(userName: string, userEmail: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json'
    });
    const encryptedPassword = CryptoJS.MD5(password).toString().toUpperCase();
    const body = {
      traceID: 'string',
      token: 'string',
      userID: 0,
      userName,
      userEmail,
      password: encryptedPassword,
      ua: 'string'
    };

    return this.http.post<any>(this.registerUrl, body, { headers, withCredentials: true  })
      .pipe(
        tap(response => {
          if (response.message) {
            throw new Error(response.message);
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.clearTokenFromCookies();
  }

  getToken(): string | null {
    return this.tokenSubject.value || this.getTokenFromCookies();
  }
}

