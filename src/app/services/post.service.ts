import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://57.152.32.19:8443/posts'; // Updated to HTTPS

  constructor(private http: HttpClient) { }

  publishPost(title: string, sex: string, species: string, postType: string, content: string, email: string, imageURL: string, address: string, lostDate: string): Observable<any> {
    const headers = new HttpHeaders({
      
      'Content-Type': 'application/json'
    });
    const body = {
      title,
      sex,
      species,
      postType,
      content,
      email,
      imageURL,
      address,
      lostDate,
    };

    return this.http.post<any>(this.apiUrl, body, { headers, withCredentials: true })
      .pipe(
        tap(response => {
          if (response.message) {
            throw new Error(response.message);
          }
        }),
        catchError(error => {
          console.error('Publish post error:', error);
          return throwError(error);
        })
      );
  }

  getAllPosts(): Observable<any> {
    return this.http.get(this.apiUrl + '?size=10000');
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + postId);
  }

  getPostsByUserId(userId: number): Observable<any> {
    return this.http.get(this.apiUrl + '/user/' + userId);
  }

  updatePost(id: number, title: string, sex: string, species: string, postType: string, content: string, email: string, imageURL: string, address: string, lostDate: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json'
    });
    const body = {
      title,
      sex,
      species,
      postType,
      content,
      email,
      imageURL,
      address,
      lostDate,
    };

    return this.http.put<any>(this.apiUrl + '/' + id, body, { headers, withCredentials: true })
      .pipe(
        tap(response => {
          if (response.message) {
            throw new Error(response.message);
          }
        }),
        catchError(error => {
          console.error('Update post error:', error);
          return throwError(error);
        })
      );
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + postId, { withCredentials: true });
  }
}
