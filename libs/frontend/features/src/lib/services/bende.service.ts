import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IBende } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class BendeService extends EntityService<IBende> {
    constructor(http: HttpClient, notificationService: NotificationService, authService: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'bendes', notificationService, authService);
    }
}