import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlobsOverviewComponent } from './blobs/blobs-overview/blobs-overview.component';

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [BlobsOverviewComponent],
  providers: [],
  exports: [BlobsOverviewComponent],
})
export class FrontendFeaturesModule {}
