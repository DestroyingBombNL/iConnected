import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { ApiResponse } from "@ihomer/api"
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from "rxjs";
import { NotificationService } from './notifications/notification.service';
import { Entity } from "./models/entity.model";
import { AuthService } from "../auth/auth.service";

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json'
};

export abstract class EntityService<T extends Entity> {
    items = new BehaviorSubject<T[]>([]);

    constructor(
        readonly http: HttpClient,
        readonly url: string,
        readonly endpoint: string,
        private readonly notificationService: NotificationService,
        protected readonly authService: AuthService
    ) {}

    public readAll(options?: any): Observable<T[] | null> {
        console.log(`read all ${this.url}${this.endpoint}`);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`    
            }),
        };

        return this.http
            .get<ApiResponse<T[]>>(`${this.url}${this.endpoint}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as T[]),
                tap(console.log),
                catchError((err) => this.handleError(err))
            );
    }

    public readOne(id: string | null, options?: any): Observable<T> {
        console.log(`read ${this.url}${this.endpoint}/${id}`);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`    
            }),
        };
        
        return this.http
            .get<ApiResponse<T>>(`${this.url}${this.endpoint}/${id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as T),
                catchError((err) => this.handleError(err))
            );
    }

    public create(t: T): Observable<T> {
        console.log(`create ${this.url}${this.endpoint}`);
    
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`
          }),
        };
    
        return this.http
          .post<ApiResponse<T>>(`${this.url}${this.endpoint}`, t, httpOptions)
          .pipe(
            tap(console.log),
            map((response: any) => response.results as T),
            catchError((err) => this.handleError(err))
          );
    }

    public update(t: T, id: string): Observable<T | undefined> {
        console.log(`update ${this.url}${this.endpoint}/${id}`);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`    
            }),
        };

        return this.http
            .put<ApiResponse<T>>(`${this.url}${this.endpoint}/${id}`, t, httpOptions)
            .pipe(
                tap((response: ApiResponse<T>) => console.log('update', response)),
                map((response: ApiResponse<T>) => response.results as T),
                catchError((err) => this.handleError(err))
            );
    }

    public delete(id: string): Observable<boolean> {
        console.log(`delete ${this.url}${this.endpoint}/${id}`);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getTokenFromLocalStorage()}`    
            }),
        };

        return this.http
            .delete(`${this.url}${this.endpoint}/${id}`, httpOptions)
            .pipe(
                tap((response: any) => console.log('delete', response)),
                map((response: any) => !!response),
                catchError((err) => this.handleError(err))
            );
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log(`handleError in EntityService`, error);
        this.notificationService.error('Verbindingsfout', error.error.message ?? 'Deze actie kan momenteel niet uitgevoerd worden.');

        return throwError(() => new Error(error.message));
    }
}