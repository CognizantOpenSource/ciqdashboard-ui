import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Router } from '@angular/router';
import { UnSubscribable } from 'src/app/components/unsub';
import { Theme } from 'src/app/model/types.model';
import { UserConfigService } from '../../ciqdashboard/services/user-config.service';
import { APP_PERMISSIONS } from 'src/app/services/auth/auth-api';
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent extends UnSubscribable implements OnInit {

  user: any;

  darkTheme = false;

  constructor(private authService: AuthenticationService, private router: Router, private config: UserConfigService) {
    super();
  }

  ngOnInit() {
    this.managed(this.authService.user$).subscribe(user => this.user = user);
    this.managed(this.config.theme$).subscribe(it => this.darkTheme = it === Theme.dark); 
  }
  toggleTheme() {
    this.config.setTheme(this.darkTheme ? Theme.default : Theme.dark);
  }
  isAdmin(user: any) {
    return user.account.roles.map(role => role.permissions)
      .flatMap(permissions => [...permissions]).find(permission => permission.id === APP_PERMISSIONS.Admin);
  }
  getDisplayName(user: any) {
    return `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`;
  }
  getIcon(user: any): any {
    return { type: 'image', name: user.name, data: this.getImage(user), desc: user.email };
  }
  getImage(user: any) {
    return user.image || user.picture || user.photoUrl;
  }
  getImageText(user: any) {
    return `${user.lastName ? cut(user.firstName, 1) + cut(user.lastName, 1) : cut(user.firstName, 2)}`;
  }
  logout($event: MouseEvent) {
    this.authService.logout().subscribe(any => this.router.navigate(['/login']));
  }
}
function cut(value: string, len: number) {
  return (value || 'user').substr(0, len);
}
