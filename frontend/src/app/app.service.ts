import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from './User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/';

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, { headers: this.getHeaders() });
  }

getAllUsers(page: number = 1, pageSize: number = 10, searchQuery: string = ''): Observable<User[]> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', pageSize.toString());

  if (searchQuery) {
    params = params.set('search', searchQuery);
  }

  return this.http.get<User[]>('http://127.0.0.1:8000/api/user/', {
    headers: this.getHeaders(),
    params: params
  }).pipe(
    catchError(this.handleError)
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}`, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}${id}/`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  logout(): void {
    localStorage.removeItem('token');
    // Additional logout logic can go here
    localStorage.removeItem('name');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': 'Bearer ' + token
      });
    } else {
      return new HttpHeaders();
    }
  }
  isLoggedIn(): boolean {
    // Check if a token is present in local storage
    const token = localStorage.getItem('token');
    return !!token; // Convert token to boolean (true if token is present, false otherwise)
  }
  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user details:', error);
        return throwError('Failed to fetch user details. Please try again.');
      })
    );
  }
}