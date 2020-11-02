import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from '../local-storage.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './authentication.service';

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

