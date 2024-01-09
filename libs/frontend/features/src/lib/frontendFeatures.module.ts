import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { BlobDetailComponent } from './blobs/blob-detail/blob-detail.component';
import { DeelnemerNewComponent } from './deelnemer/deelnemer-new.component';
import { BlobService } from './services/blob.service';
import { UserService } from './services/user.service';
import { ProjectService } from './services/project.service';
import { BendeService } from './services/bende.service';

@NgModule({
  imports: [RouterModule, HttpClientModule, RouterLink, CommonModule, NgbModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  declarations: [BlobsOverviewComponent, DeelnemerNewComponent, BlobDetailComponent],
  providers: [BlobService, UserService, ProjectService, BendeService],
  exports: [BlobsOverviewComponent, DeelnemerNewComponent],
})
export class FrontendFeaturesModule {}

