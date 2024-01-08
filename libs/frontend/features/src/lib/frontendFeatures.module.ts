import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { LoginComponent } from './deelnemer/login/deelnemer-login.component';
import { RegisterComponent } from './deelnemer/register/deelnemer-register.component';
import { BlobService } from './services/blob.service';
import { UserService } from './services/user.service';
import { ProjectService } from './services/project.service';
import { BendeService } from './services/bende.service';
import { AuthService } from './auth/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
  ],
  declarations: [
    BlobsOverviewComponent, 
    RegisterComponent, 
    LoginComponent,
  ],
  providers: [
    BlobService,
    UserService,
    ProjectService,
    BendeService,
    BlobsOverviewComponent, 
    RegisterComponent, 
    LoginComponent,
    AuthService
  ],
  exports: [
    BlobsOverviewComponent, 
    RegisterComponent, 
    LoginComponent,
  ],
})
export class FrontendFeaturesModule {}
