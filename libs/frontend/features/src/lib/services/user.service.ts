import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { IUser } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { frontendEnvironment } from '@ihomer/shared/util-env';

@Injectable({
    providedIn: 'root'
})
export class UserService extends EntityService<IUser> {

    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, frontendEnvironment.backendUrl, 'users', notificationService);
    }

    getDistinctTagsForAllUsers(): Observable<string[]> {
        const tagsUrl = `${this.url}${this.endpoint}/tags`;
        return this.http.get<string[]>(tagsUrl);
    }
}