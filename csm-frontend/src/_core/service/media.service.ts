import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenRetriverService } from './token-retriver.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient, private tokenRetriverService: TokenRetriverService) { }

  private BASE_URL = 'http://localhost:3333/media'
  private userId: string = ''
  getMediaData(mediaId: any): Observable<any> {
    const API_URL = `${this.BASE_URL}/getContent/${mediaId}`
    return this.http.get(API_URL)
  }

  getMedia(mediaId: any) {
    const API_URL = `${this.BASE_URL}/getContent/${mediaId}`
    return this.http.get(API_URL)
  }
  updateMediaDesc(mediaId: any, mediaData: any): Observable<any> {
    this.tokenRetriverService.getUserId().subscribe(userId => {
      this.userId = userId
    })
    const API_URL = `${this.BASE_URL}/updateContentDesc/${this.userId}/${mediaId}`
    return this.http.put(API_URL, mediaData)
  }

  updateImage(mediaId: any, mediaData: any): Observable<any> {
    this.tokenRetriverService.getUserId().subscribe(userId => {
      this.userId = userId
    })
    const API_URL = `${this.BASE_URL}/updateContent/${this.userId}/${mediaId}`
    return this.http.put(API_URL, mediaData)
  }

  getAllMediaContent(): Observable<any> {
    const API_URL = `${this.BASE_URL}/getAllContent`
    return this.http.get(API_URL)
  }
}
