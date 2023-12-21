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
    imageRoof?: string;
    
    constructor(private blobService: BlobService) {
        this.imageRoof = 'assets/images/imageRoof.jpg'
    }

    ngOnInit() {
        this.subscription = this.blobService.readAll().subscribe((results) =>{
            if (results !== null) {
                this.blobs = results;
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}