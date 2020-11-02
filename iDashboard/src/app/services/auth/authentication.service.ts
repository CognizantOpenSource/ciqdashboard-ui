import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, forkJoin } from 'rxjs';
import { map, filter, tap, switchMap } from 'rxjs/operators';
import { LocalStorage } from '../local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthRestAPIService } from './auth-rest-api.service';
import { parseApiError } from 'src/app/components/util/error.util';
function parseQuery(queryString): any {
  const query = {};
  const pairs: Array<string> = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  pairs.map(pair => pair.split('=')).forEach(pair => {
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  });
  return query;
}
const LOGGED_OUT = '__logout__';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _auth: Observable<any>;
  private _authSource = new ReplaySubject<any>(1);
  touched = false;

  constructor(
    private storageService: LocalStorage,
    private toastr: ToastrService, private restApi: AuthRestAPIService,
    private router: Router) {
    this._auth = this._authSource.asObservable();
    this.validateLogin();
  }
  private validateLogin() {
    const qParams = parseQuery(window.location.search);
    if (qParams.token) {
      this.storageService.setItem('auth_token', qParams.token).subscribe(() => this.loadProfile());
    } else {
      this.isValid().subscribe(valid => valid ? this.loadProfile() : this._authSource.next(false));
    }
  }
  private isValid(): Observable<boolean> {
    return forkJoin(this.storageService.getItem('auth_token'), this.storageService.getItem('expires_at'))
      .pipe(map(([token, expiresAt]) => {
        const expiry: number = new Date(expiresAt).getTime();
        return token && expiry
          && moment(expiry).isAfter(moment().add(60, 'minutes'));
      }));
  }
  validateToken() {
    this.isValid().subscribe(valid => {
      if (!valid) {
        this._authSource.next(false);
      }
    });
  }
  get state$(): Observable<boolean> {
    return this._auth.pipe(map(auth => auth && (auth === true || auth.email) ? true : false));
  }
  get user$(): Observable<any> {
    return this._auth.pipe(filter(auth => auth && auth.email));
  }
  get permissions$(): Observable<Array<string>> {
    return this.user$.pipe(map(user => user.account.roles.flatMap(it => it.permissions).map(it => it.id)));
  }
  public login(username: string, password: string, type = 'native') {
    return this.authenticate({ type, username, password });
  }
  public logout(): Observable<any> {
    this.storageService.removeAll();
    return this.storageService.deleteItem('auth_token').pipe(
      switchMap(() => this.storageService.deleteItem('expires_at')),
      map(() => LOGGED_OUT), tap(it => this._authSource.next(it)));
  }

  private authenticate(payload) {
    return this.restApi.createToken(payload).subscribe((res: any) => {
      this.storageService.setItem('auth_token', res.auth_token).subscribe();
      this.storageService.setItem('expires_at', res.expiresAt).subscribe();
      this.loadProfile();
    }, error => {
      if (error.status === 401 || error.status === 404) {
        this.toastr.error( (error.error && error.error.message) || 'invalid email id/password');
      } else {
        this.toastr.error(error.status ? error.error.message : 'application is offline')
      }
    });
  }
  private loadProfile() {
    this.restApi.getProfile().subscribe(profile => {
      this.touched = true;
      this._authSource.next(profile);
    }, error =>
      this.toastr.error(error.status ? error.error.message : 'application is offline'));
  }
  public createUser(userData) {
    return this.restApi.createUser(userData).subscribe(user => {
      if (user.id) {
        this.toastr.success('user created successfully');
        this.router.navigate(['/login']);
      } else {
        this.toastr.error('error while creating user');
      }
    }, error => {
      const parsedError = parseApiError(error, 'error while creating user');
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  public updatePassword(newPassword, oldPassword) {
    return this.restApi.updatePassword({ newPassword, oldPassword }).subscribe(res => {
      if (res.status === 200) {
        this.toastr.success('password changed successfully');
        this.router.navigate(['/user/profile']);
      } else {
        this.toastr.error('error while updating password');
      }
    }, error => {
      const parsedError = parseApiError(error, 'error while updating password');
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  public resetPassword(email, password) {
    return this.restApi.resetPassword({ email, password }).subscribe(res => {
      if (res.status === 200) {
        this.toastr.success('password changed successfully');
      } else {
        this.toastr.error('error while reseting password');
      }
    }, error => {
      const parsedError = parseApiError(error, 'error while reseting password');
      this.toastr.error(parsedError.message, parsedError.title);
    });
  }
  generateAPIToken(): Observable<any> {
    return this.restApi.generateAPIToken();
  }
}
