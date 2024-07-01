// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://57.151.98.131:8080'; // Base URL for your backend API

  constructor(private http: HttpClient) { }

  getUserData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}`, {
      headers: {
        'accept': '*/*'
      }
    });
  }

  updateUserProfile(userId: string, userProfile: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${userId}`, userProfile);
  }
  
  // Add more methods for other API calls as needed
}
