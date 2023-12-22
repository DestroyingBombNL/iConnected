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
    private baseUrl: string;
    private tagsEndpoint: string;

    constructor(http: HttpClient, notificationService: NotificationService
    ) {
        super(http, frontendEnvironment.backendUrl, 'users', notificationService);
        this.baseUrl = frontendEnvironment.backendUrl;
        this.tagsEndpoint = '/tags';
    }

    getDistinctTagsForAllUsers(): Observable<string[]> {
        const tagsUrl = `${this.baseUrl}${this.tagsEndpoint}`;
        return this.http.get<string[]>(tagsUrl);
    }
}