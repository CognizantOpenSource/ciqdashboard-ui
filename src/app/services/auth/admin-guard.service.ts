// © [2021] Cognizant. All rights reserved.
 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
 
//     http://www.apache.org/licenses/LICENSE-2.0
 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { tap, map, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DEFAULT_ERROR_MESSAGES } from 'src/app/components/util/error.util';
import { Observable } from 'rxjs';
import { APP_PERMISSIONS } from './auth-api';
/**
* AdminGuard
* @author Cognizant
*/
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
