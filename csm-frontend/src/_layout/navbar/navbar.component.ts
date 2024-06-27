import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/_core/auth/auth.service';
import { TokenService } from 'src/_core/auth/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private router:Router, private authService:AuthService, private token:TokenService)
  {}
  logout():void{
    this.authService.logout();
    this.token.removeToken('jwt_token')
    this.router.navigateByUrl('');
  }
}
