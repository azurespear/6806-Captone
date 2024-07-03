import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profileUrl = 'http://57.152.32.19:8080/users/profile'; // Profile URL for GET
  private apiUrl = 'http://57.152.32.19:8080/users'; // Base URL for PUT

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
    console.log(generateCurlCommand(this.profileUrl, 'GET', options.headers));
    return this.http.get<any>(this.profileUrl, options);
  }

  updateUser(userData: { userName: string, password: string, userEmail: string }): Observable<any> {
    const options = this.getHttpOptions();
    console.log(generateCurlCommand(this.apiUrl, 'PUT', options.headers, userData));
    return this.http.put<any>(this.apiUrl, userData, options);
  }
}

function generateCurlCommand(url: string, method: string, headers: HttpHeaders, body: any = null): string {
  let curlCommand = `curl -X '${method}' \\\n  '${url}' \\\n`;

  headers.keys().forEach(key => {
    const value = headers.get(key);
    curlCommand += `  -H '${key}: ${value}' \\\n`;
  });

  if (body) {
    const bodyString = JSON.stringify(body);
    curlCommand += `  -d '${bodyString}'`;
  }

  return curlCommand;
}


