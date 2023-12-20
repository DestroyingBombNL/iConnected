import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';
import { BlobsService } from './services/blobs.service';
@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [BlobsOverviewComponent],
  providers: [BlobsService],
  exports: [BlobsOverviewComponent],
})
export class FrontendFeaturesModule {}
