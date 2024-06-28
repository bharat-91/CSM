import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../_authorization/login/login.component';
import { RegisterComponent } from '../_authorization/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../_layout/navbar/navbar.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TokenInterceptor } from 'src/_core/interceptor/token.interceptor';
import { AgGridModule } from 'ag-grid-angular';
import { QuillModule } from 'ngx-quill';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedButtonRenderer } from 'src/shared/sharedButtons';
import { EditFormComponent } from './pages/user/edit-form/edit-form.component';
import { ViewcontentComponent } from './pages/user/viewcontent/viewcontent.component';
import { SafePipe } from '../shared/pipe/dom-sanitizer.pipe';
import { AllContentComponent } from './pages/user/all-content/all-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgChartsAngular } from 'ag-charts-angular';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    UserProfileComponent,
    DashboardComponent,
    SharedButtonRenderer,
    EditFormComponent,
    ViewcontentComponent,
    SafePipe,
    AllContentComponent,
    AllContentComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule,
    QuillModule,
    AngularEditorModule,
    AgChartsAngular,
    BrowserAnimationsModule
  ],
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
