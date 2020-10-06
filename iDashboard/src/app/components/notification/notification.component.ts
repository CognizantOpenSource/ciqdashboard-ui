import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state, group, sequence } from '@angular/animations';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideOut', [
      state('in', style({ height: '*', opacity: 0 })),
      transition(':enter', [
        style({ height: '0', opacity: .5 }),
        group([
          animate(300, style({ height: '*' })),
          animate('300ms ease-out', style({ opacity: '1' }))
        ])

      ])
    ]),
    trigger('easeOut', [
      state('in', style({ opacity: '*' })),
      transition(':enter', [
        style({ opacity: .0 }),
        group([
          animate('300ms ease-out', style({ opacity: '*' }))
        ])
      ])
    ]),
    trigger('listOutRight', [
      transition('* => void', [
        style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': 'none' }),
        sequence([
          animate('.25s ease', style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate('.1s ease', style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none' }))
        ])
      ]),
      transition('void => *', [
        style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
        sequence([
          animate('.1s ease', style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate('.35s ease',
            style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': 'none' }))
        ])
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit {

  drawerState = false;

  notifications: Notification[];

  get hasNotifications() {
    return this.notifications && this.notifications.length > 0;
  }

  constructor(private ntfService: NotificationService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.ntfService.notifications$.subscribe(_ => this.notifications = _);
  }
  toggleDrawerState() {
    this.drawerState = !this.drawerState;
  }
  onAction(notification: Notification) {
    if (notification.callback) {
      notification.callback(notification, this.router);
    } else if (notification.link) {
      this.router.navigateByUrl(notification.link);
    } else {
      this.toastr.error('Invalid Notification Action');
    }
    this.remove(notification);
    this.hideDrawer();
  }
  remove(notification: Notification) {
    this.ntfService.remove(notification);
    if (this.notifications.length === 0) {
      this.hideDrawer();
    }
  }
  hideDrawer() {
    this.drawerState = false;
  }
}
export interface Notification {
  title: string;
  message: string;
  time: Date;
  action: string;
  link?: string;
  callback?: (it: Notification, router: Router) => void;
}
