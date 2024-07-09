import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://57.152.32.19:8443/posts'; // Updated to HTTPS

  constructor(private http: HttpClient) { }

  addCommentToPost(postId: number, content: string): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json'
    });
    const body = {
      content
    };

    return this.http.post<any>(this.apiUrl + '/' + postId + '/comments', body, { headers, withCredentials: true })
      .pipe(
        tap(response => {
          if (response.message) {
            throw new Error(response.message);
          }
        }),
        catchError(error => {
          console.error('Add comment error:', error);
          return throwError(error);
        })
      );
  }

  getCommentsFromPost(postId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + postId + '/comments');
  }
}
