import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
  public setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
  public getTokenData(): string | null {
    return localStorage.getItem('profileData');
  }
  
  public removeToken(key:string): void {
    localStorage.removeItem(key);
  }

  checkAuthentication(): boolean {
    const token = this.getToken();
    return !!token;
 }



}
