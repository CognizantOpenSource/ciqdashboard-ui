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
import { Observable, ReplaySubject } from 'rxjs';
import { map, take, filter, tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Theme } from 'src/app/model/types.model';
import { IUserConfig } from 'src/app/model/access.model';
import { IDashBoardApiService } from 'src/app/modules/ciqdashboard/services/ciqdashboard-api.service';
/**
* UserConfigService
* @author Cognizant
*/
@Injectable({
  providedIn: 'root'
})
export class UserConfigService {


  private _systemSource = new ReplaySubject<any>(1);
  private _system$ = this._systemSource.asObservable();

  private _userSource = new ReplaySubject<any>(1);
  private _user$ = this._userSource.asObservable();

  constructor(
    private storage: LocalStorage, private api: IDashBoardApiService, private auth: AuthenticationService,
    private toastr: ToastrService, private notification: NotificationService) {
    this.auth.state$.pipe(filter(s => s), take(1)).subscribe(this.init.bind(this));
  }
  private init() {
    this.loadUserSettings();
    this.userSettings$.subscribe(settings => {
      this.setSettings(settings);
    });
  }
  loadUserSettings() {
    this.api.getUserSettings().pipe(catchError(() => {
     //this.toastr.error('error while reading user settings');
      return this.storage.getItem('user.settings').pipe(map(it =>  it ||  {}));
    })).subscribe(it => this._userSource.next(it));    
    this.storage.getItem('user.settings').subscribe(it => this._userSource.next(it || {}));
  }
  get userSettings$(): Observable<any> {
    return this._user$.pipe(filter(it => !!it));
  }
  get theme$() {
    return this.userSettings$.pipe(map(it => (it.theme) || Theme.default));
  }
  loadSystemSettings() {
    this.api.getSystemSettings().subscribe(res => this._systemSource.next(res[0] || res));
  }
  get systemSettings$(): Observable<any> {
    return this._system$;
  }
  updateUserConfig(config: any): Observable<IUserConfig> {
    return this.api.putUserSettings(config).pipe(tap(it => this._userSource.next(it)));
  }
  getUserConfig(): Observable<IUserConfig> {
    return this.userSettings$.pipe(take(1));
  }

  private setSettings(config: IUserConfig): void {
    this.storage.setItem('user.settings', config).subscribe();
  }
  getDefaultDashBoardConfig(): Observable<any> {
    return this.systemSettings$.pipe(take(1), map(config => config.dashboard));
  }
  setTheme(theme: Theme) {
    this.getUserConfig().subscribe(settings => {
      settings.theme = theme;
      this._userSource.next(settings);      
    });
  }
  reloadWhitelist(): Observable<any> {
    return this.api.reloadWhitelist();
  }
}
