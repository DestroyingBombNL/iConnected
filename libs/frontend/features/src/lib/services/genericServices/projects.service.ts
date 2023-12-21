import { HttpClient } from '@angular/common/http';
import { EntityService } from '../entity.service';
import { IProject } from '@ihomer/shared/api';
import { NotificationService } from '../notifications/notification.service';

export class ProjectService extends EntityService<IProject> {
    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, 'http://localhost:3000/api', 'projects', notificationService);
    }
}