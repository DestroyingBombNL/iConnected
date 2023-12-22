import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlobService } from '../../services/blob.service';
import { IBlob } from '@ihomer/shared/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ihomer-blobs-overview',
  templateUrl: './blobs-overview.component.html',
  styleUrls: ['./blobs-overview.component.css'],
})
export class BlobsOverviewComponent implements OnInit, OnDestroy {
  blobs: IBlob[] = [];
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  blueskyImage?: string;
  grassImage?: string;

  constructor(private blobService: BlobService) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.jpg';
    this.blueskyImage = 'assets/bluesky.png';
    this.grassImage = 'assets/grassImage.jpg';
  }

  ngOnInit() {
    this.subscription = this.blobService.readAll().subscribe((results) => {
      if (results !== null) {
        this.blobs = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getBlobsInRows(): any[][] {
    const blobsInRows = [];
    for (let i = 0; i < this.blobs.length; i += 3) {
      blobsInRows.push(this.blobs.slice(i, i + 3));
    }
    return blobsInRows;
  }

  calculateColumnClass(totalRooms: number): string {
    switch (totalRooms) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-6';
      case 3:
        return 'col-4';
      default:
        return 'col'; // default to equal width columns for other cases
    }
  }
}
