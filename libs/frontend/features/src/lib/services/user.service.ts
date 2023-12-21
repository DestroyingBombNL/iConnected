import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IUser } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserService extends EntityService<IUser> {
    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, 'http://localhost:3000/api', 'users', notificationService);
    }

    getDistinctTagsForAllUsers(): Observable<string[]> {
        return this.http
        .get<string[]>('http://localhost:3000/api/users/tags');
    }
}