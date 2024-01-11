import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IProject } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends EntityService<IProject> {
    constructor(http: HttpClient, notificationService: NotificationService, authService: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'projects', notificationService, authService);
    }
}