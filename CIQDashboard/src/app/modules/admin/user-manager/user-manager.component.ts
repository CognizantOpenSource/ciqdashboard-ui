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
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnSubscribable, EntityFilter, EntityCallBackFilter } from 'src/app/components/unsub';
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DashboardProjectService } from '../../ciqdashboard/services/ciqdashboard-project.service';
import { IUser } from 'src/app/model/access.model';
import { passwordConstraints } from '../../sign-up/sign-up.component';
/**
* UserManagerComponent
* @author Cognizant
*/
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
  hasCrypto = crypto && crypto.getRandomValues;

  passwordConstraints = passwordConstraints();

  roleNameFilter = new EntityFilter('name');
  rolePermissionsFilter = new EntityCallBackFilter(role => role.permissions.map(it => it.name).join(','));
  projectNameFilter = new EntityFilter('name');

  constructor(
    private userManagerService: UserManagerService, private auth: AuthenticationService, private projectsService: DashboardProjectService,
    private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private location: Location) {
    super();
  }

  ngOnInit() {
    if (history.state.navigateFromRole) {
      this.isNavigateFromRole = history.state.navigateFromRole;
    }
    this.managed(this.route.params).subscribe(params =>
      this.userManagerService.getUser(params.userId).subscribe((user: IUser) => {
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
        this.managed(this.projectsService.projects$).subscribe((projects:any[]) => {
          this.projects = projects;
          this.projectsService.getUserProjects(user.id).subscribe(projectIds => {
            for (const projectObject of projects) {
              for (const projectId of projectIds) {
                if (projectObject.id === projectId) {
                  projectObject.selected = true;
                  this.projectSelected.push(projectObject);
                }
              }
            }
          });
        });
      }));
  }

  updateDetails($event: MouseEvent) {
    if (getRoleIds(this.roleSelected).length === 0) {
      this.toastr.error('please select atleast one role');
    } else {
      const account = this.user.account;
      account.roleIds = getRoleIds(this.roleSelected);
      this.userManagerService.updateAccount(account).subscribe();

      this.projectsService.updateUserProjects(
        this.user.id, getProjectIds(this.projectSelected) ).subscribe(() => {
        this.toastr.success('user projects mapped successfully.');
      }, error => this.toastr.error(error.error.message));


      this.userManagerService.updateUser(this.user).subscribe(res => {
        this.toastr.success('user updated successfully.');
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
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'+this.passwordConstraints.symbols)
        .map(x => x[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * x.length)])
        .join('');
    if(!this.passwordConstraints.regex.test(this.newPassword)){
      this.refreshPassword();
    }
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
