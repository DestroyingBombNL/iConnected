import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IBlob } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BlobService extends EntityService<IBlob> {
    constructor(http: HttpClient, notificationService: NotificationService, authService: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'blobs', notificationService, authService);
    }

    getDistinctTypesForAllBlobs(): Observable<string[]> {
        const typesUrl = `${this.url}${this.endpoint}/types`;
        return this.http.get<string[]>(typesUrl);
    }
}