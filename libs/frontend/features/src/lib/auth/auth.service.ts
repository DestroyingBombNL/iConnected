import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { frontendEnvironment } from '@ihomer/shared/util-env';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILogin, ILoginResponse, IUser } from '@ihomer/shared/api';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AuthService'
);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAdmin = false;
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
      this.logout();
    }

    if (localToken) {
      this.validateToken(localToken).subscribe((isValid) => {
        if (!isValid) {
          this.logout();
        }
      });
    }
  }

  login(login: ILogin): Observable<IUser | undefined> {
    return this.http.post<any | undefined>(`${frontendEnvironment.backendUrl}users/login`, login, {headers: this.headers})
      .pipe(
        map((response) => {
          if (!response) return undefined;
          response = response.results as ILoginResponse;
          this.isAdmin = response.isAdmin;
          this.saveUserToLocalStorage(response.user);
          this.saveUserTokenToLocalStorage(response.token);
          return response.user;
        })
      );
  }

  validateToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(`${frontendEnvironment.backendUrl}auth/validatetoken`, { headers: headers
    }).pipe(
      map((response) => {
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
    if (!user) return;
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  private saveUserTokenToLocalStorage(token: string): void {
    if (!token) return;
    localStorage.setItem(this.AUTH_TOKEN, token);
  }


}