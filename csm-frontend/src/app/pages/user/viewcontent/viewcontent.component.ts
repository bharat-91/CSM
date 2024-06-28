import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../../../_core/service/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewcontent',
  templateUrl: './viewcontent.component.html',
  styleUrls: ['./viewcontent.component.scss']
})
export class ViewcontentComponent implements OnInit {
  mediaId: string | null = null;
  imageUrl: any = '';
  fileType: string = '';
  desc: string = '';
  title: string = '';

  constructor(private mediaService: MediaService, private router: Router, private activeRouter: ActivatedRoute) {}

  ngOnInit(): void {
    this.mediaId = this.activeRouter.snapshot.paramMap.get('id');
    if (this.mediaId) {
      this.fetchMediaData();
    }
  }

  fetchMediaData(): void {
    this.mediaService.getMediaData(this.mediaId!).subscribe(
      (res: any) => {
        if (res.response === true) {
          console.log(res.data);
          this.imageUrl = res.data.contentPath;
          this.desc = res.data.description.replace(/<\/?[^>]+(>|$)/g, '');
          this.title = res.data.title;
          this.fileType = res.data.fileType;
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
}
