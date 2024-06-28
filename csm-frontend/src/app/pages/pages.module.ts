import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from 'src/_layout/navbar/navbar.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AgChartsAngular } from 'ag-charts-angular';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    AgChartsAngular
  ]
})
export class PagesModule { }
