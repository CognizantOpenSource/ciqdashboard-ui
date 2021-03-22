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
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from '../local-storage.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './authentication.service';

/**
* AuthInterceptor
* @author Cognizant
*/
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorage,
    private authService: AuthenticationService,
    private router: Router, private toastr: ToastrService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.localStorage.getItem('auth_token').pipe(switchMap(token =>
      next.handle(token ? this.auth(req, token) : req))).pipe(catchError(this.handleAuthError()));
  }
  private auth(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handleAuthError() {
    return (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 && !(err && err.url || '').endsWith('/auth/token')) {
          this.toastr.warning('please login again', 'session expired');
          this.authService.logout().subscribe(any => {
            //this.router.navigate(['/login'];
          });

        }
      }
      throw err;
    };
  }
}

