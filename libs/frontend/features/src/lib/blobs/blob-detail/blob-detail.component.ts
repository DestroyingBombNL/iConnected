import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBlob } from '@ihomer/api';
import { Subscription } from 'rxjs';
import { BlobService } from '../../services/blob.service';
import { ActivatedRoute } from '@angular/router';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'ihomer-blob-detail',
  templateUrl: './blob-detail.component.html',
  styleUrls: ['./blob-detail.component.css'],
})
export class BlobDetailComponent implements OnInit, OnDestroy {
  blob = {} as IBlob;
  blobId: string | null = null;
  subscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private blobService: BlobService,
    private entityService: EntityService<IBlob>, // Provide both Entity and IBlob types
  ) {}

  ngOnInit() {
    this.blobId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.blobService.readOne(this.blobId)
      .subscribe((blob) => {
        this.blob = blob;
        
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
