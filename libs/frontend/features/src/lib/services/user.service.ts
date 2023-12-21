import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IUser } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class UserService extends EntityService<IUser> {
    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, 'http://localhost:3000/api', 'users', notificationService);
    }
}