// user.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profileUrl = 'https://57.152.32.19:8443/users/profile'; // Updated to HTTPS
  private apiUrl = 'https://57.152.32.19:8443/users'; // Updated to HTTPS

  constructor(private http: HttpClient, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) { }

  getHttpOptions(includeContentType: boolean = true) {
    let headers = new HttpHeaders({
      'accept': '*/*'
    });
    if (includeContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return { headers, withCredentials: true };
  }

  getUserData(): Observable<any> {
    const options = this.getHttpOptions(false);
    return this.http.get<any>(this.profileUrl, options);
  }

  updateUser(userData: { userName: string,  password: string, userEmail: string}): Observable<any> {
    const options = this.getHttpOptions();
    const updatedUserData = {
      ...userData,
      password: CryptoJS.MD5(userData.password).toString().toUpperCase()
    };
    return this.http.put<any>(this.apiUrl, updatedUserData, options);
  }
}


