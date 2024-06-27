import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/_authorization/login/login.component';
import { RegisterComponent } from 'src/_authorization/register/register.component';

const routes: Routes = [
  {path:'' , component:LoginComponent},
  {path:'register' , component:RegisterComponent},
  {path: 'pages', loadChildren:() => import("./pages/pages-routing.module").then(m=>m.PagesRoutingModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
