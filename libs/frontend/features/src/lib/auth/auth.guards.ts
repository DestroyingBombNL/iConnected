import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '@ihomer/shared/api';
import { AuthService } from './auth.service';

/**
 * Verifies that user is logged in before navigating to routes.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router,) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserFromLocalStorage().pipe(
      map((user: IUser | null) => {
        if (user && this.authService.getTokenFromLocalStorage()) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router,) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserFromLocalStorage().pipe(
      map((user: IUser | null) => {
        if (user && this.authService.getTokenFromLocalStorage() && this.authService.isAdmin) {
          return true;
        } else {
          this.router.navigate(['..']);
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}