import { Component, Injectable, OnInit } from '@angular/core';
import { MediaService } from '../../../../_core/service/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TokenRetriverService } from 'src/_core/service/token-retriver.service';
import { DashboardService } from '../../../../_core/service/dashboard.service';
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
  isAdmin = false;
  author: string = '';

  constructor(
    private mediaService: MediaService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private tokenRetrieverService: TokenRetriverService,
    private dashboardService: DashboardService
  ) {}

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
          this.author = res.authorName;
          // Swal.fire('Done', 'Media data fetched successfully', 'success');
          
          this.tokenRetrieverService.getUserRole().subscribe(userRole => {
            this.isAdmin = (userRole === 'Admin');
          });
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

  onDelete(): void {
    if (this.mediaId) {
      this.dashboardService.deleteContent(this.mediaId).subscribe(
        (res: any) => {
          if (res.success == true) {
            Swal.fire('Deleted!', 'Media content deleted successfully.', 'success');
            this.router.navigate(['']);
          } else {
            Swal.fire('Error', 'Failed to delete media content', 'error');
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
}
