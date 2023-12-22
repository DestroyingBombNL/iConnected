import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IBlob } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';

@Injectable({
    providedIn: 'root'
})
export class BlobService extends EntityService<IBlob> {
    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, frontendEnvironment.backendUrl, 'blobs', notificationService);
    }
}