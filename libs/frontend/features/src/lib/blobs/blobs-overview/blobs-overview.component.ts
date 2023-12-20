import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlobsService } from './../../services/blobs.service';
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
    
    constructor(private blobsService: BlobsService) {
        this.imageRoof = 'assets/images/imageRoof.jpg'
    }

    ngOnInit() {
        this.subscription = this.blobsService.readAll().subscribe((results) =>{
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