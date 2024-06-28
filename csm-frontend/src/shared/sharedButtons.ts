import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-button-renderer',
  template: `
    <button class="btn btn-outline-danger" (click)="onDeleteClicked()">
      Delete
    </button>
    <button class="btn btn-outline-success" (click)="onEditClicked()">
      Edit
    </button>
    <button class="btn btn-outline-info" (click)="onViewClicked()">
      View
    </button>
  `,
  styles: [`
    button {
      min-width: 70px;
      margin: 0 5px;
    }
  `]
})
export class SharedButtonRenderer {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onDeleteClicked(): void {
    if (this.params.onDelete instanceof Function) {
      this.params.onDelete(this.params.data);
    }
  }
  onEditClicked(): void {
    if (this.params.onEdit instanceof Function) {
      this.params.onEdit(this.params.data);
    }
  }
  onViewClicked(): void {
    if (this.params.onView instanceof Function) {
      this.params.onView(this.params.data);
    }
  }
}
