import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/_core/auth/auth.service';
import { IUser } from 'src/_core/interface/iuser';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  selectedFile!: File;
  userData = new FormData();
  constructor(private fb:FormBuilder, private authService: AuthService, private router:Router){}
  registerForm = this.fb.group({
    username:[null, [Validators.required]],
    password:[null, [Validators.required, Validators.min(3)]],
    email:[null, [Validators.required]],
    bio:[null, [Validators.required]],
  })

  successNotification(){
    if(this.registerForm.invalid){
      Swal.fire("Please fill the form Correctly", 'warning')
    }
      this.authService.register(this.registerForm.value).subscribe(
        (res:any) =>{
          if(res.response=== true){
            Swal.fire('Done', 'User Registered!', 'success');
            this.router.navigateByUrl('')
          }else if(res.status == 401){
            console.log("No User Found");
            
          }
        },
        (err:any) => {
          const errorMessage = err.error.message || err.error || err.statusText || err.error.details || err.status || "An unknown error occurred. Please try again.";
          console.log(errorMessage);
        }
      )
  }
}
