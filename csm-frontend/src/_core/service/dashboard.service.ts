import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { TokenRetriverService } from './token-retriver.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private userId = ''
  private BASE_URL = 'http://localhost:3333'
  private jwtHelper = new JwtHelperService()
  constructor(private http:HttpClient, private getUserId: TokenRetriverService) { }

  getUserContent():Observable<any>{
    this.getUserId.getUserId().subscribe(userId =>{
      this.userId = userId
    }) 

    const API_URL = `${this.BASE_URL}/auth/user/getUserContent/${this.userId}`
    return this.http.get(API_URL)
  }

  uploadContent(mediaData:any):Observable<any>{
    this.getUserId.getUserId().subscribe(userId =>{
      this.userId = userId
    }) 
    const API_URL = `${this.BASE_URL}/media/upload/${this.userId}`
    return this.http.post(API_URL, mediaData)
  }

  deleteContent(mediaId:any):Observable<any>{
    this.getUserId.getUserId().subscribe(userId=>{
      this.userId = userId
    })
    const API_URL = `${this.BASE_URL}/media/deleteContent/${this.userId}/${mediaId}`
    return this.http.delete(API_URL)
  }

  editContent(mediaId:any, mediaData:any):Observable<any>{
    this.getUserId.getUserId().subscribe(userId =>{
      this.userId = userId
    })

    const API_URL = `${this.BASE_URL}/media/updateContentDesc/${this.userId}/${mediaId}`
    return this.http.put(API_URL, mediaData)
  }
}
