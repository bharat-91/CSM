import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MediaService } from 'src/_core/service/media.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {
  fileName = '';
  isLoading: boolean = false;
  imageURL: string = '';
  mediaId: string | null = null;
  selectedFile!: File;
  editContentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private mediaService: MediaService,
    private router: Router
  ) {
    this.editContentForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      content: [null]
    });
  }

  ngOnInit(): void {
    this.mediaId = this.activeRouter.snapshot.paramMap.get('id');
    this.fetchMediaData();
  }

  fetchMediaData(): void {
    if (this.mediaId) {
      this.mediaService.getMediaData(this.mediaId).subscribe(
        (res: any) => {
          if (res.response) {
            this.imageURL = res.data.contentPath;
            this.editContentForm.patchValue({
              title: res.data.title,
              description: res.data.description,
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
  }

  showPreview(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageURL = '';
      this.fileName = '';
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      this.showPreview(event);
    }
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  updateData(): void {
    if (this.mediaId) {
      this.isLoading = true;
      this.mediaService.updateMediaDesc(this.mediaId, this.editContentForm.value).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res.response) {
            Swal.fire('Success', 'Content updated successfully', 'success');
            this.router.navigateByUrl('/pages/user-dashboard');
          } else {
            Swal.fire('Error', 'Failed to update content', 'error');
          }
        },
        (err: any) => {
          this.isLoading = false;
          console.error(err);
          const errorMessage = err.error.message || 'An unknown error occurred. Please try again.';
          Swal.fire('Error', errorMessage, 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  }

  updateImage(): void {
    this.isLoading = true;
    const formData: FormData = new FormData();
    if (this.selectedFile) {
      formData.append('content', this.selectedFile);
    }
    this.mediaService.updateImage(this.mediaId, formData).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.response) {
          Swal.fire('Success', 'Content updated successfully', 'success');
          this.router.navigateByUrl('/pages/user-dashboard');
        } else {
          Swal.fire('Error', 'Failed to update content', 'error');
        }
      },
      (err: any) => {
        this.isLoading = false;
        console.error(err);
        const errorMessage = err.error.message || 'An unknown error occurred. Please try again.';
        Swal.fire('Error', errorMessage, 'error');
      }
    );
  }
}
