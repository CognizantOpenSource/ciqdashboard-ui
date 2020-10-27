import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnSubscribable, EntityFilter, EntityCallBackFilter } from 'src/app/components/unsub';
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DashboardProjectService } from '../../idashboard/services/idashboard-project.service';
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['../../../components/form/form.css', './user-manager.component.css']
})
export class UserManagerComponent extends UnSubscribable implements OnInit {
  user;
  projectSelected = [];
  roleSelected = [];
  projects = [];
  roles = [];
  isNavigateFromRole = false;
  isResetCredActive = false;
  newPassword;
  roleNameFilter = new EntityFilter('name');
  rolePermissionsFilter = new EntityCallBackFilter(role => role.permissions.map(it => it.name).join(','));
  projectNameFilter = new EntityFilter('name');
  hasCrypto = crypto && crypto.getRandomValues
  constructor(
    private userManagerService: UserManagerService, private projectService: DashboardProjectService, private auth: AuthenticationService,
    private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private location: Location) {
    super();
  }

  ngOnInit() {
    if (history.state.navigateFromRole) {
      this.isNavigateFromRole = history.state.navigateFromRole;
    }
    this.managed(this.route.params).subscribe(params =>
      this.userManagerService.getUser(params.userId).subscribe(user => {
        this.user = user;
        this.userManagerService.loadRoles().subscribe(roles => {
          this.roles = roles;
          for (const roleObject of roles) {
            for (const userRole of user.account.roles) {
              if (userRole.name === roleObject.name) {
                roleObject.selected = true;
                this.roleSelected.push(roleObject);
              }
            }
          }
        });
        this.projectService.projects$.subscribe(projects => {
          this.projects = projects;
          for (const projectObject of this.projects) {
            for (const projectId of user.account.projectIds) {
              if (projectObject.id === projectId) {
                projectObject.selected = true;
                this.projectSelected.push(projectObject);
              }
            }
          }
        });
      }));
  }

  updateDetails($event: MouseEvent) {
    if (getRoleIds(this.roleSelected).length === 0) {
      this.toastr.error('please select atleast one role');
    } else {
      const account = this.user.account;
      account.roleIds = getRoleIds(this.roleSelected);
      account.projectIds = getProjectIds(this.projectSelected);
      this.userManagerService.updateAccount(account).subscribe();
      this.userManagerService.updateUser(this.user).subscribe(res => {
        this.toastr.success('User updated successfully.');
      }, error => this.toastr.error(error.error.message));
    }
  }

  close($event: MouseEvent) {
    this.location.back();
  }
  roleSelectionChanged($event) {
    this.roleSelected = $event;
  }
  projectSelectionChanged($event) {
    this.projectSelected = $event;
  }

  refreshPassword() {
    if (this.hasCrypto)
      this.newPassword = Array(16)
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$')
        .map(x => x[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * x.length)])
        .join('');
  }
  resetCred(user) {
    this.auth.resetPassword(user.email, this.newPassword);
  }
}
function getRoleIds(rolesList: any[]) {
  return [...rolesList.map(it => it.name)];
}
function getProjectIds(projectList: any[]) {
  return [...projectList.map(it => it.id)];
}
