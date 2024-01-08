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
@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router,) {}

  canActivate(): Observable<boolean> {
    console.log('canActivate LoggedIn');
    return this.authService.currentUser$.pipe(
      map((user: IUser | null) => {
        if (user && user.token) {
          return true;
        } else {
          console.log('not logged in, reroute to /');
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canActivateChild LoggedIn');
    return this.canActivate();
  }
}