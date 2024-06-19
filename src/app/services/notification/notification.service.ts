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
import { Notification } from 'src/app/components/notification/notification.component';
import { BehaviorSubject } from 'rxjs';
/**
* NotificationService
* @author Cognizant
*/
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notifications = [];
  private _notificationsSource = new BehaviorSubject<Notification[]>(this._notifications);
  private _notifications$ = this._notificationsSource.asObservable();

  constructor() {

  }
  get notifications$() {
    return this._notifications$;
  }
  add(notification: Notification) {
    this._notifications = [notification, ...this._notifications];
    this._notificationsSource.next(this._notifications);
  }
  remove(notification: Notification) {
    this._notifications.splice(this._notifications.indexOf(notification), 1);
    this._notificationsSource.next(this._notifications);
  }
}
