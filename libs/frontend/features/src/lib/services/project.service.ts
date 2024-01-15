import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EntityService, httpOptions } from './entity.service';
import { ApiResponse, IProject } from '@ihomer/shared/api';
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends EntityService<IProject> {
    constructor(http: HttpClient, notificationService: NotificationService, private authServe: AuthService
    ) {
        super(http, frontendEnvironment.backendUrl, 'projects', notificationService, authServe);
    }

    public override readAll(options?: any): Observable<IProject[] | null> {
        console.log(`read all ${this.url}${this.endpoint}`);
        
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`    
            }),
        };

        return this.http
        .get<ApiResponse<IProject[]>>(`${this.url}${this.endpoint}`, {
            ...options,
            ...httpOptions,
        })
        .pipe(
            map((response: any) => response.results as IProject[]),
            tap(console.log),
            catchError((err) => this.handleError(err))
        );
    }

    getDistinctTypesForAllProjects(): Observable<string[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authServe.getTokenFromLocalStorage()}`    
            }),
            
        };
        return this.http
            .get<string[]>(`${this.url}${this.endpoint}/types`, {
                ...httpOptions,
            })
    }
}