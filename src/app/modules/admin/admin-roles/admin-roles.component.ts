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
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UnSubscribable, EntityFilter } from 'src/app/components/unsub';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
/**
 * AdminRolesComponent
 * @author Cognizant
*/
@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['../../../components/form/form.css', './admin-roles.component.css']
})
export class AdminRolesComponent extends UnSubscribable implements OnInit {
  roles = [];
  selected = [];
  roleNameFilter = new EntityFilter('name');
  constructor(
    private userManagerService: UserManagerService, private auth: AuthenticationService,
    private router: Router, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.userManagerService.loadRoles().subscribe(roles => {
      this.roles = roles;
    });
  }
  deleteRole($event: MouseEvent) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select user to delete.');
      return;
    }
    if (confirm(`Are you sure to delete role/s?`)) {
      this.userManagerService.deleteRoles(getRoleIds(this.selected)).subscribe(() => {
        this.toastr.success('Role/s deleted successfully.');
        this.userManagerService.loadRoles().subscribe(roles => {
          this.roles = roles;
        });
      }, error => this.toastr.error(error.error.message));
    }
  }
  addRole($event: MouseEvent) { this.router.navigate(['/admin/roles/_/edit']); }
  selectionChanged($event) { this.selected = $event; }
}
function predicateRoleByName(role: any, name: string): boolean {
  return (!name || name === '')
    || role.name.toLowerCase().includes(name.toLowerCase());
}
function getRoleIds(roleList: any[]) {
  const roleIds = [];
  for (const roleObject of roleList) {
    roleIds.push(roleObject.name);
  }
  return roleIds;
}
