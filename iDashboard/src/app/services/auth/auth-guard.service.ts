import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, UrlSegment } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { tap, take } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.state$.pipe(take(1), tap(auth => {
            if (!auth) {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
        }));
    }
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.state$.pipe(take(1), tap(auth => {
            if (!auth) {
                this.router.navigate(['/login'], { queryParams: { returnUrl: segments.join('/') } });
            }
        }));
    }
}
