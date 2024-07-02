import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { IUser } from '../interface/iuser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.log("An Error Occurred ", error.error);
    } else {
      console.log(`Backend Error ${error.status}`);
    }

    console.log(error);
    return throwError(() => new Error(error.error.text))
  }
  private BASE_URL = 'http://localhost:3333'
  private jwtHelper = new JwtHelperService()

  logout():Observable<any>{
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      return new Observable(observer => {
        observer.error('No token found in local storage');
        observer.complete();
      });
    }

    let userId;
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      userId = decodedToken._id

      if (!userId) {
        throw new Error('User ID not found in token');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return new Observable(observer => {
        observer.error('Unable to extract user ID from token');
        observer.complete();
      });
    }

    const apiUrl = `${this.BASE_URL}/user/logout/${userId}`;
    return this.http.post<any>(apiUrl, {}).pipe(
      catchError(error => {
        console.error('Logout request error:', error);
        throw error; 
      })
    );
  }
  register(userData: any): Observable<any> {
    let API_URL = `${this.BASE_URL}/auth/user/register`
    return this.http.post(API_URL,userData)
  }

  login(loginData:any):Observable<any>{
    const API_URL = `${this.BASE_URL}/auth/user/login`
    return this.http.post(API_URL, loginData)

  }


  getRoleName(): string | null {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      new Observable(observer => {
        observer.error('No token found in local storage');
        observer.complete();
      });
      return token
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.roleName : null;
  }

}
