import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'https://57.152.32.19:8443/images'; // Updated to HTTPS

  constructor(private http: HttpClient, private authService: AuthService) { }

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<string>(this.apiUrl, formData, { responseType: 'text' as 'json' });
  }
}
