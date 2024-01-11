import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { LoginComponent } from './deelnemer/login/deelnemer-login.component';
import { RegisterComponent } from './deelnemer/register/deelnemer-register.component';
import { ProfileComponent } from './account/profile/profile.component';
import { UpdateProfileComponent } from './account/update-profile/update-profile.component';
import { BlobService } from './services/blob.service';
import { UserService } from './services/user.service';
import { ProjectService } from './services/project.service';
import { BendeService } from './services/bende.service';
import { AuthService } from './auth/auth.service';
import { LogoutComponent } from './deelnemer/logout/deelnemer-logout.component';
import { ProjectsOverviewComponent } from './projects/projects-overview/projects-overview.component';
import { BendesOverviewComponent } from './bendes/bendes-overview/bendes-overview.component';
import { BlobCreateComponent } from './blobs/blob-create/blob-create.component';
import { FilterService } from './services/filter.service';
import { LoggedInAuthGuard } from './auth/auth.guards';
import { BendeCreateComponent } from './bendes/bende-create/bende-create.component';
import { Project } from './services/models/project.model';
import { ProjectCreateComponent } from './projects/project-create/project-create.component';

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
    ProfileComponent,
    UpdateProfileComponent,
    ProjectsOverviewComponent,
    BendesOverviewComponent,
    LogoutComponent,
    BlobCreateComponent,
    BendeCreateComponent,
    ProjectCreateComponent,
  ],
  providers: [
    BlobService,
    UserService,
    ProjectService,
    BendeService,
    BlobsOverviewComponent, 
    RegisterComponent, 
    LoginComponent,
    AuthService,
    FilterService,
    LoggedInAuthGuard,
    HttpClient,
  ],
  exports: [
    BlobsOverviewComponent, 
    RegisterComponent, 
    LoginComponent,
    ProfileComponent,
    UpdateProfileComponent,
    LogoutComponent,
    BlobCreateComponent,
    BendeCreateComponent,
    ProjectCreateComponent,
  ],
})
export class FrontendFeaturesModule {}
