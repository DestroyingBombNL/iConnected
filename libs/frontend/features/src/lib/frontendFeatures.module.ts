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
import { BendesOverviewComponent } from './bendes/bendes-overview/bendes-overview.component';
import { ProjectsOverviewComponent } from './projects/projects-overview/projects-overview.component';

@NgModule({
    RegisterComponent, 
    LoginComponent,
    RegisterComponent, 
    LoginComponent,
})
export class FrontendFeaturesModule {}
