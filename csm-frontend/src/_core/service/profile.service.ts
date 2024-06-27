import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }
  private jwtHelper = new JwtHelperService()

  private BASE_URL = 'http://localhost:3333/auth/user'
  getProfileData():Observable<any>{
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

    const apiUrl = `${this.BASE_URL}/getUser/${userId}`;
    return this.http.get<any>(apiUrl)
  }

  uploadImage(profilePic:any):Observable<any>{
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
    let API_URL = `${this.BASE_URL}/uploadImage/${userId}`
    return this.http.post(API_URL, profilePic)
  }
}
