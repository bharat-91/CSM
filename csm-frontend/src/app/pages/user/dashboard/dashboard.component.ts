import { Component, SecurityContext } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { DashboardService } from '../../../../_core/service/dashboard.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedButtonRenderer } from 'src/shared/sharedButtons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  frameworkComponents: any;
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
  pagination = true
  data: any[] = [];
  imageURL!: string;
  paginationPageSize = 10
  paginationPageSizeSelector = [1, 10, 100]
  public rowData: any[] = []
  fileName = '';
  selectedFile: File | undefined;

  public columnDefs: ColDef[] = [
    { field: "contentPath", headerName: "URL", flex: 1, autoHeight: true , editable:true},
    {
      field: "contentPath",
      autoHeight: true,
      headerName: "Image",
      cellRenderer: (params: any) => {
        return `<img src="${params.value}" style="width: 50PX; height: 50PX; border-radius: 50%;" />`;
      }
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      cellRenderer: (params: any) => {
        const noHtmlDescription = params.data.description.replace(/<\/?[^>]+(>|$)/g, "");
        return noHtmlDescription;
      }
    },
    { field: "fileType", headerName: "Type of Content", autoHeight: true },
    { field: "status", headerName: "Status of the Content", autoHeight: true },
    { field: "title", headerName: "Title", autoHeight: true },
    {
      headerName: 'Actions', flex: 1,
      cellRenderer: 'deleteButtonRenderer',
      cellRendererParams: {
        onDelete: this.onDeleteClicked.bind(this),
        onEdit: this.onEditClicked.bind(this),
        onView: this.onViewClicked.bind(this),
      },
    },
  ]

  constructor(private dashboardService: DashboardService, private fb: FormBuilder, private sanitizer: DomSanitizer, private router: Router) {

    this.frameworkComponents = {
      "deleteButtonRenderer": SharedButtonRenderer
    }
  }

  uploadContentForm = this.fb.group({
    title: [null, [Validators.required]],
    description: [null, [Validators.required]],
    content: [null],
    uploadedFileName: [null, [Validators.required]],
    status: ['Archived']
  });



  // showPreview(event: any) {
  //   const file = (event.target).files[0];
  //   this.uploadContentForm.patchValue({
  //     content: file
  //   });
    // this.uploadContentForm.get('content')?.updateValueAndValidity();
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.imageURL = reader.result as string;
    // }
    // reader.readAsDataURL(file);
  // }


  onFileSelected(event: any) {
    // this.showPreview(event)
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
    }
  }
  uploadContentDraft() {
    this.uploadContentForm.patchValue({ status: 'Draft' });
    this.uploadContent();
  }

  uploadContentArch() {
    this.uploadContentForm.patchValue({ status: 'Archived' });
    this.uploadContent();
  }

  uploadContentPublished() {
    this.uploadContentForm.patchValue({ status: 'Published' });
    this.uploadContent();
  }
  async uploadContent() {
    const formData = new FormData();
    formData.append('title', this.uploadContentForm.value.title || '');
    formData.append('description', this.uploadContentForm.value.description || '');
    if (this.selectedFile) {
      formData.append('content', this.selectedFile);
    }
    formData.append('status', this.uploadContentForm.value.status || 'Archived');
  
    this.dashboardService.uploadContent(formData).subscribe(
      (res: any) => {
        if (res.response === true) {
          Swal.fire("Done", "Content Uploaded", "success");
          this.rowData = [...this.rowData, res.data];
          this.uploadContentForm.reset(); 
        } else {
          Swal.fire('Error', 'Failed to upload content', 'error');
        }
      },
      (err: any) => {
        console.error(err);
        Swal.fire('Error', 'An unknown error occurred. Please try again.', 'error');
      }
    );
  }
  


  ngOnInit() {
    this.dashboardService.getUserContent().subscribe(
      (res: any) => {
        if (res.response === true) {
          this.data = res
          console.log(res);
          this.rowData = res.details

        }
      }
    )
  }

  onDeleteClicked(media: any) {

    this.dashboardService.deleteContent(media._id).subscribe(
      (res: any) => {
        if (res.response === true) {
          Swal.fire("Done", "Content delete", "success");
          this.rowData = this.rowData.filter(item => item._id !== media._id)
        } else {
          Swal.fire('Error', 'Failed to upload content', 'error');
        }
      },
      (err: any) => {
        console.log(err);
        const errorMessage = err.error.message || 'An unknown error occurred. Please try again.';
        console.log(errorMessage);
        Swal.fire('Error', errorMessage, 'error');
      }
    )
  }
  onEditClicked(media: any) {
    console.log(media._id);
    this.router.navigate(['/pages/edit-content', media._id]);
  }
  onViewClicked(media: any) {
    console.log(media._id);
    this.router.navigate(['/pages/view-content', media._id]);
  }

}
