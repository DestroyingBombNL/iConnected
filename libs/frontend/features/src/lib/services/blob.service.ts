import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntityService, httpOptions } from './entity.service';
import { ApiResponse, IBlob } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BlobService extends EntityService<IBlob> {
    constructor(http: HttpClient, notificationService: NotificationService, authService: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'blobs', notificationService, authService);
    }

    public override readAll(options?: any): Observable<IBlob[] | null> {
        console.log(`read all ${this.url}${this.endpoint}`);
        
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`    
            }),
        };

        return this.http
        .get<ApiResponse<IBlob[]>>(`${this.url}${this.endpoint}`, {
            ...options,
            ...httpOptions,
        })
        .pipe(
            map((response: any) => response.results as IBlob[]),
            tap(console.log),
            catchError((err) => this.handleError(err))
        );
    }
}