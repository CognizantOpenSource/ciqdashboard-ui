import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { tap, take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.state$.pipe(take(1), tap(auth => {
            if (auth && !this.router.navigated) {
                const returnUrl = route.queryParamMap.get('returnUrl');
                if (returnUrl)
                    this.router.navigateByUrl(returnUrl)
                else
                    this.router.navigate(['/home']);
            }
        }), map(state => !state));
    }
}
