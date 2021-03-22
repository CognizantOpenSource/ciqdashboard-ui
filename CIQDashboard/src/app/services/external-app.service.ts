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
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ExternalApp {
  url: string;
  token: string;
  tokenType: string;
  tokenParam?: string;
  tokenTypeParam?: string;
  [key: string]: string;
}

export interface ExternalAppStatus {
  app: ExternalApp;
  loaded: boolean;
  fullscreen?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ExternalAppService {

  private _stateSource = new BehaviorSubject<ExternalAppStatus>({
    app: undefined,
    loaded: false,
  });
  private _state$ = this._stateSource.asObservable();

  constructor() { }

  get status$(): Observable<ExternalAppStatus> {
    return this._state$;
  }
  mount(app: ExternalApp, fullscreen = false) {
    this._stateSource.next({ app, loaded: true, fullscreen });
  }
  unmount(app: ExternalApp) {
    this._stateSource.next({ app, loaded: false });
  }
}
