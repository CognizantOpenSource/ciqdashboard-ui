import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UnSubscribable } from 'src/app/components/unsub';
import { Project } from 'src/app/model/data.model';
import { UserConfigService } from 'src/app/modules/idashboard/services/user-config.service';
import { Theme } from 'src/app/model/types.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DashboardProjectService } from '../idashboard/services/idashboard-project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends UnSubscribable implements OnInit {
  user: any;
  projects: Array<Project> = [];
  theme$: Observable<Theme>;
  constructor(
    private authService: AuthenticationService,
    private projectService: DashboardProjectService,
    private config: UserConfigService) {
    super();
  }
  ngOnInit() {
    this.theme$ = this.config.userSettings$.pipe(map(it => (it.theme) || Theme.default));
    this.managed(this.authService.user$).subscribe(user => this.user = user);
    this.projectService.loadProjects();
    this.managed(this.projectService.projects$).subscribe(projects => {
      this.projects = projects as Array<Project>;
    });

  }
  isAdmin(user: any) {
    return user.account.roles.map(role => role.permissions)
      .flatMap(permissions => [...permissions]).find(permission => permission.id === 'leap.permission.admin');
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
    return user.lastName ? cut(user.firstName, 1) + cut(user.lastName, 1) : cut(user.firstName, 2);
  }
}

export function cut(value: string, len: number) {
  return (value || 'user').substr(0, len);
}
