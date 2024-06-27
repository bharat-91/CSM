import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/_core/service/profile.service';

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

  constructor(private router:Router, private profileService:ProfileService){}

  ngOnInit(){
this.fetchProfileData()
  }
  fetchProfileData(){
    this.profileService.getProfileData().subscribe(
      (res:any )=>{
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

  uploadImage(){
    // this.profileService.uploadImage().subscribe((res)=>{

    // })
  }
}
