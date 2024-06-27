import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/_core/auth/auth.service';
import { TokenService } from 'src/_core/auth/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private fb:FormBuilder, private router:Router, private authService:AuthService, private token:TokenService){}

  loginForm = this.fb.group({
    email:[null, [Validators.required, Validators.email]],
    password:[null, [Validators.required, Validators.min(3)]]
  })

  login(){
    if(this.loginForm.invalid){
      Swal.fire("Please fill the form Correctly")
    }
    this.authService.login(this.loginForm.value).subscribe(
      (res:any) =>{
          if(res.response === true){
            this.token.setToken(res.data.token)
            this.router.navigateByUrl('/pages/user-profile')
          Swal.fire('Done', 'User Logged in!', 'success');
          }
      }
    )
  }
}
