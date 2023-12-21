import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@ihomer/shared/api';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';

export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};


@Injectable()
export class UserService {

    endpoint = `${frontendEnvironment.backendUrl}/users`;


    constructor(
        private readonly http: HttpClient
        ) {}

    public readAllUsers(options?: any): Observable<IUser[] | null> {
        console.log(`read all users ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public readOneUser(_id: string | null, options?: any): Observable<IUser> {
        console.log(`read ${this.endpoint}/${_id}`);
        return this.http
            .get<ApiResponse<IUser>>(`${this.endpoint}/${_id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    public create(user: IUser): Observable<IUser> {
        console.log(`create ${this.endpoint}`);
    
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };
    
        return this.http
          .post<ApiResponse<IUser>>(this.endpoint, user, httpOptions)
          .pipe(
            tap(console.log),
            map((response: any) => response.results as IUser),
            catchError(this.handleError)
          );
    }
    
    getDistinctTagsForAllUsers(): Observable<string[]> {
        return this.http.get<string[]>(`${this.endpoint}/tags`);
    }
    

    // public update(user: IUser): Observable<IUser> {
    //     console.log(`update ${this.endpoint}/${user._id}`);
    //     return this.http
    //       .put<ApiResponse<IUser>>(`${this.endpoint}/${user._id}`, user)
    //       .pipe(
    //         tap(console.log),
    //         catchError((error) => {
    //           console.error('Update error:', error);
    //           throw error;
    //         })
    //       );
    // }

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}