import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IBende } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';

@Injectable({
    providedIn: 'root'
})
export class BendeService extends EntityService<IBende> {
    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, frontendEnvironment.backendUrl, 'bendes', notificationService);
    }
}