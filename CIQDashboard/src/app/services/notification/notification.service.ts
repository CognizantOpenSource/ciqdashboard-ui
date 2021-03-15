import { Injectable } from '@angular/core';
import { Notification } from 'src/app/components/notification/notification.component';
import { BehaviorSubject } from 'rxjs';

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
