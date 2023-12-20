import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, RouterLink} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { DeelnemerNewComponent } from './deelnemer/deelnemer-new.component';
import { BlobsService } from './services/blobs.service';
import { UserService } from './services/user.service';

@NgModule({
  imports: [RouterModule, HttpClientModule, RouterLink, CommonModule, NgbModule, FormsModule, ReactiveFormsModule,],
  declarations: [BlobsOverviewComponent, DeelnemerNewComponent],
  providers: [BlobsService, UserService],
  exports: [BlobsOverviewComponent, DeelnemerNewComponent],
})
export class FrontendFeaturesModule {}

