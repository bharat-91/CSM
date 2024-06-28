import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/_core/auth/auth.service';
import { TokenService } from 'src/_core/auth/token.service';
import { ProfileService } from 'src/_core/service/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  username!:string
  bio!:string
  email!:string
  role!:string
  imageAddress!: string
  fileName = '';
  selectedFile: File | undefined;

  constructor(private router: Router, private profileService: ProfileService, private fb: FormBuilder, private authService: AuthService, private tokenService: TokenService) { }
  editDetailsForm = this.fb.group({
    username: [null, [Validators.required]],
    email: [null, [Validators.required]],
    bio: [null, [Validators.required]],
  })


  ngOnInit(){
this.fetchProfileData()

  }
  fetchProfileData() {
    this.profileService.getProfileData().subscribe(
      (res: any) => {
        if(res.response === true){
          console.log(res);
          
          this.username = res.details.username || undefined
          this.bio = res.details.bio || undefined
          this.email = res.details.email || undefined
          this.role = "User" || undefined
          this.imageAddress = res.details.profilePic || undefined
        }
      }
    )
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
    }
  }
  editDetails() {
    if (this.editDetailsForm.invalid) {
      Swal.fire('Error', 'Please Fill The Details', 'error');
      console.log(this.editDetailsForm);
      return
    }
    console.log(this.editDetailsForm);
    this.profileService.editUserDetails(this.editDetailsForm.value).subscribe((res: any) => {
      if (res.response === true) {
        Swal.fire('Done', 'Profile Data Edited Successfully', 'success');
        this.fetchProfileData()
        } else {
          Swal.fire('Error', 'Failed to upload profile Data', 'error');
        }
    },
      (err: any) => {
        const errorMessage =
          err.error.message ||
          err.error ||
          err.statusText ||
          err.error.details ||
          err.status ||
          'An unknown error occurred. Please try again.';
        console.log(errorMessage);
        Swal.fire('Error', errorMessage, 'error');
      }
    )

  }

  logout(): void {
    this.authService.logout();
    this.tokenService.removeToken('jwt_token')
    this.router.navigateByUrl('');
  }
  uploadProfilePic() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please select a file to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('content', this.selectedFile);

    this.profileService.uploadImage(formData).subscribe(
      (res) => {
        if (res.response === true) {
          Swal.fire('Done', 'Profile Pic Uploaded Successfully', 'success');
        } else {
          Swal.fire('Error', 'Failed to upload profile pic', 'error');
        }
      },
      (err) => {
        const errorMessage =
          err.error.message ||
          err.error ||
          err.statusText ||
          err.error.details ||
          err.status ||
          'An unknown error occurred. Please try again.';
        console.log(errorMessage);
        Swal.fire('Error', errorMessage, 'error');
      }
    );
  }
}
