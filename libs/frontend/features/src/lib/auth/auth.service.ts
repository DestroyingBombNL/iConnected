import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILogin, IUser } from '@ihomer/shared/api';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AuthService'
);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly CURRENT_USER = 'currentuser';
  private readonly AUTH_TOKEN = 'auth_token';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  constructor(private http: HttpClient, private router: Router) {
    const localUser = this.getUserFromLocalStorage();
    const localToken = this.getTokenFromLocalStorage();

    if (!localUser || !localToken) {
      console.log('No user or token found.');
      this.logout();
    }

    if (localToken) {
      this.validateToken(localToken).subscribe((isValid) => {
        if (!isValid) {
          console.log('token invalid');
          this.logout();
        }
      });
    }
  }

  login(login: ILogin): Observable<IUser | undefined> {
    return this.http.post<any | undefined>(`${frontendEnvironment.backendUrl}users/login`, login, {headers: this.headers})
      .pipe(
        map((response) => {
          if (!response.results) return undefined;
          const {token, ...user} = response.results;
          this.saveUserToLocalStorage(user);
          this.saveUserTokenToLocalStorage(token);
          return response;
        })
      );
  }

  validateToken(token: string): Observable<boolean> {
    console.log('validate token: ', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(`${frontendEnvironment.backendUrl}auth/validatetoken`, { headers: headers
    }).pipe(
      map((response) => {
        console.log(response);
        if (response) return true;
        return false;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  logout(): void {
    this.router
      .navigate(['./login'])
      .then(() => {
          console.log('logout - removing local user info');
          localStorage.removeItem(this.CURRENT_USER);
          localStorage.removeItem(this.AUTH_TOKEN);
      })
  }

  getUserFromLocalStorage(): Observable<IUser | null> {
    const itemFromStorage = localStorage.getItem(this.CURRENT_USER);
    if (itemFromStorage === null) {
      return of(null);
    } else {
      const localUser = JSON.parse(itemFromStorage);
      return of(localUser);
    }
  }

  getTokenFromLocalStorage(): string | undefined {
    const tokenFromStorage = localStorage.getItem(this.AUTH_TOKEN);
    if (!tokenFromStorage) return undefined;
    return tokenFromStorage;
  }

  private saveUserToLocalStorage(user: IUser): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  private saveUserTokenToLocalStorage(token: string): void {
    localStorage.setItem(this.AUTH_TOKEN, token);
  }
}