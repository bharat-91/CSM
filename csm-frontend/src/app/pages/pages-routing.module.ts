import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { EditFormComponent } from './user/edit-form/edit-form.component';
import { ViewcontentComponent } from './user/viewcontent/viewcontent.component';
import { AllContentComponent } from './user/all-content/all-content.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {path:'user-profile', component:UserProfileComponent},
  { path: 'user-dashboard', component: DashboardComponent },
  { path: 'edit-content/:id', component: EditFormComponent },
  { path: 'view-content/:id', component: ViewcontentComponent },
  { path: 'view-all-content', component: AllContentComponent },
  { path: 'adminRoutes', component: AdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
