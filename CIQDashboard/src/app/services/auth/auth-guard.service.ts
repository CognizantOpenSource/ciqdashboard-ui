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
