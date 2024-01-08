import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { LoginComponent } from './deelnemer/login/deelnemer-login.component';
import { RegisterComponent } from './deelnemer/register/deelnemer-register.component'
import { BlobService } from './services/blob.service';
import { UserService } from './services/user.service';
import { ProjectService } from './services/project.service';
import { BendeService } from './services/bende.service';
import {}

@NgModule({
  imports: [RouterModule, HttpClientModule, RouterLink, CommonModule, NgbModule, FormsModule, ReactiveFormsModule, NgSelectModule, FormControl, FormGroup],
  declarations: [BlobsOverviewComponent, RegisterComponent, LoginComponent],
  providers: [BlobService, UserService, ProjectService, BendeService],
  exports: [BlobsOverviewComponent, RegisterComponent, LoginComponent],
})
export class FrontendFeaturesModule {}

