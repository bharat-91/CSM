import { Component } from '@angular/core';
import { MediaService } from 'src/_core/service/media.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-content',
  templateUrl: './all-content.component.html',
  styleUrls: ['./all-content.component.scss']
})
export class AllContentComponent {
  isLoading = false;
  mediaList: any[] = [];
constructor(private mediaService:MediaService, private activeRouter:ActivatedRoute, private router:Router){}

ngOnInit(){
  this.fetchMediaData()
}

fetchMediaData(): void {
  
    this.mediaService.getAllMediaContent().subscribe(
      (res: any) => {
        if (res.response === true) {
          console.log(res.data);
          this.mediaList = res.data; 
          Swal.fire('Done', 'Media data fetched successfully', 'success');
        } else {
          Swal.fire('Error', 'Failed to fetch media data', 'error');
        }
      },
      (err: any) => {
        console.error(err);
        const errorMessage = err.error.message || 'An unknown error occurred. Please try again.';
        Swal.fire('Error', errorMessage, 'error');
      }
    );
}
onViewClicked(mediaId: string) {
  this.router.navigate(['/pages/view-content', mediaId]);
}
}