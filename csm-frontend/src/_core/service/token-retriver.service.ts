import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenRetriverService {
  constructor(private jwtHelper: JwtHelperService, private tokenService:TokenService) {}

  getUserId(): Observable<string> {
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
      userId = decodedToken._id;

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      return of(userId); 
    } catch (error) {
      console.error('Error decoding token:', error);
      return new Observable(observer => {
        observer.error('Unable to extract user ID from token');
        observer.complete();
      });
    }
  }
  getUserRole(): Observable<string> {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      return new Observable(observer => {
        observer.error('No token found in local storage');
        observer.complete();
      });
    }

    let userRole;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      userRole = decodedToken.roleName;

      if (!userRole) {
        throw new Error('User Role not found in token');
      }

      return of(userRole); 
    } catch (error) {
      console.error('Error decoding token:', error);
      return new Observable(observer => {
        observer.error('Unable to extract user ID from token');
        observer.complete();
      });
    }
  }
}
