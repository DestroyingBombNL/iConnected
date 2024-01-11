import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    constructor(http: HttpClient, notificationService: NotificationService, private authServe: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'blobs', notificationService, authServe);
    }

    getDistinctTypesForAllBlobs(): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authServe.getTokenFromLocalStorage()}`    
            }),
            
        };
        return this.http
            .get<string[]>(`${this.url}${this.endpoint}/types`, {
                ...httpOptions,
            })
    }
}