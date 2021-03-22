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
import { UnSubscribable, EntityFilter } from 'src/app/components/unsub';
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';


@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['../../../components/form/form.css', './role-manager.component.css']
})
export class RoleManagerComponent extends UnSubscribable implements OnInit {
  role = { name: '', desc: '', permissions: [], permissionIds: [] };
  permissions = [];
  isAddRole = false;
  selected = [];

  permissionNameFilter = new EntityFilter('name');

  constructor(
    private userManagerService: UserManagerService, private route: ActivatedRoute,
    private toastr: ToastrService, private location: Location) {
    super();
    this.isAddRole = true;
  }

  ngOnInit() {
    this.managed(this.route.params).subscribe(params => {
      if (params.roleId !== '_') {
        this.userManagerService.getRole(params.roleId).subscribe(role => {
          this.role = role;
          this.isAddRole = false;
          this.userManagerService.getPermissions().subscribe(permissions => {
            this.permissions = permissions;
            this.permissions.filter(permission =>
              role.permissions.find(rolePermission => rolePermission.id === permission.id)
            ).forEach(permission => {
              permission.selected = true;
              this.selected.push(permission);
            });
          });
        });
      } else {
        this.userManagerService.getPermissions().subscribe(permissions => {
          this.permissions = permissions;
        });
      }
    });
  }

  close($event: MouseEvent) {
    this.location.back();
  }
  addRole($event: MouseEvent) {
    if (!this.role.name) {
      this.toastr.warning('please provide valid role name');
      return;
    }
    this.role.permissionIds = this.selected.map(permission => permission.id);
    this.role.permissions = this.selected;
    this.userManagerService.addRole(this.role);
  }
  updateRole($event: MouseEvent) {
    if (!this.role.name) {
      this.toastr.warning('please provide valid role name');
      return;
    }
    this.role.permissionIds = this.selected.map(permission => permission.id);
    this.role.permissions = this.selected;
    this.userManagerService.updateRole(this.role);
  }

  permissionSelectionChanged($event) {
    this.selected = $event;
  }
}
