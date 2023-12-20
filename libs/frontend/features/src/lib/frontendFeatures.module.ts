import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeelnemerNewComponent } from './deelnemer/deelnemer-new.component';

// import {RouterModule, RouterLink} from '@angular/router';

@NgModule({
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule,],
  declarations: [BlobsOverviewComponent, DeelnemerNewComponent],
  providers: [],
  exports: [BlobsOverviewComponent, DeelnemerNewComponent],
})
export class FrontendFeaturesModule {}
