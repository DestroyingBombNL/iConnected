import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { NotificationService } from './notifications/notification.service';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';

export const httpOptions = {
    observe: 'body',
    responseType: 'json'
};

@Injectable({ providedIn: 'root' })
export class FilterService {

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationService,
    ) {}

    public filter(param: string | null, options?: any): Observable<string[]> {
        console.log(`filter ${frontendEnvironment.backendUrl}filters/${param}`);
        return this.http
            .get<any[]>(`${frontendEnvironment.backendUrl}filters/${param}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as string[]),
                catchError((err) => this.handleError(err))
            );
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log(`handleError in FilterService`, error);
        this.notificationService.error('Verbindings fout', error.error.message ?? 'Deze actie kan momenteel niet uitgevoerd worden.');

        return throwError(() => new Error(error.message));
    }
}
