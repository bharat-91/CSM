import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAnalyticsService {
  private BASE_URL = 'http://localhost:3333'
  private jwtHelper = new JwtHelperService()
  constructor(private http:HttpClient) { }

  getData(searchMonth:any):Observable<any>{
    const API_URL = `${this.BASE_URL}/auth/admin/admin/analytics?selectedMonth=${searchMonth}`
    return this.http.get(API_URL)
  }
}
