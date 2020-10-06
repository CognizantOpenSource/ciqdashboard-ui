import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    private static adminPermission = 'leap.permission.admin';

    constructor(private router: Router, private toastr: ToastrService, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.permissions$.pipe(map(it => it.includes(AdminGuard.adminPermission)),
            tap(it => !it && this.toastr.error('permissions denied!') && this.router.navigate(['/home'])));
    }
}
