import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { IBlob, ApiResponse } from '@ihomer/shared/api';
import { Injectable } from '@angular/core';
import { frontendEnvironment } from '@ihomer/shared/util-env';

export const httpOptions = {
  observe: 'body',
  responseType: 'json',
};

@Injectable({
  providedIn: 'root',
})
export class BlobsService {
  endpoint = `${frontendEnvironment.backendUrl}/blobs`;

  constructor(private readonly http: HttpClient) {}

  public readAll(options?: any): Observable<IBlob[] | null> {
    console.log(`list of Blobs ${this.endpoint}`);

    return this.http
      .get<ApiResponse<IBlob[]>>(this.endpoint, {
        ...options,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        map((response: any) => response.results as IBlob[]),
        tap(console.log),
        catchError(this.handleError)
      );
  }

  public readOne(id: string | null, options?: any): Observable<IBlob | null> {
    console.log(`read one blob ${this.endpoint}/${id}`);
    return this.http
      .get<ApiResponse<IBlob>>(`${this.endpoint}/${id}`, {
        ...options,
        observe: 'body',
        responseType: 'json',
      })
      .pipe(
        tap(console.log),
        map((response: any) => response.results as IBlob),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError in BlobsService', error);
    return throwError(() => new Error(error.message));
  }
}
