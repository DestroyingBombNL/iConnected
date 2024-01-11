import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntityService } from './entity.service';
import { ApiResponse, IBende, IBlob, IProject, IUser } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends EntityService<IUser> {
    private readonly authServ: AuthService;

    constructor(http: HttpClient, notificationService: NotificationService, authServ: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'users', notificationService, authServ);
        this.authServ = authServ;
    }

    getDistinctTagsForAllUsers(): Observable<string[]> {
        const tagsUrl = `${this.url}${this.endpoint}/tags`;
        return this.http.get<string[]>(tagsUrl);
    }

    getProfile(id: string | null, options?: any): Observable<{ user: IUser | undefined, blobs: Array<IBlob>, bendes: Array<IBende>, projects: Array<IProject> }> {
        console.log(`read ${this.url}${this.endpoint}/profile/${id}`);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authServ.getTokenFromLocalStorage()}`
          }),
        };
    
        return this.http
            .get<ApiResponse<{ user: IUser | undefined, blobs: Array<IBlob>, bendes: Array<IBende>, projects: Array<IProject> }>>(`${this.url}${this.endpoint}/profile/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as { user: IUser | undefined, blobs: Array<IBlob>, bendes: Array<IBende>, projects: Array<IProject> }),
                catchError(this.handleError)
            );
    }
    
}