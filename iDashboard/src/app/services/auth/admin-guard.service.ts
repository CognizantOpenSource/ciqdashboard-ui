import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { tap, map, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_ERROR_MESSAGES } from 'src/app/components/util/error.util';
import { Observable } from 'rxjs';
import { APP_PERMISSIONS } from './auth-api';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanLoad {
    constructor(private router: Router, private toastr: ToastrService, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.permissions$.pipe(take(1), map(it => it.includes(APP_PERMISSIONS.Admin)),
            tap(admin => this.doAdminCheck(admin)));
    }
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.permissions$.pipe(take(1), map(it => it.includes(APP_PERMISSIONS.Admin)),
            tap(admin => this.doAdminCheck(admin)));
    }
    private doAdminCheck(admin: boolean) {
        if (!admin) {
            this.toastr.error(DEFAULT_ERROR_MESSAGES.E403);
            const state = this.router.routerState.snapshot;
            if (!this.router.navigated ||
                (state && state.url && state.url.startsWith('/login'))) {
                this.router.navigate(['/home']);
            }
        }
    }
}
