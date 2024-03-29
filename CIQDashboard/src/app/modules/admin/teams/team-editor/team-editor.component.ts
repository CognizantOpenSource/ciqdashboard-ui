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
import { parseApiError } from 'src/app/components/util/error.util';

/**
* TeamEditorComponent
* @author Cognizant
*/
@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['../../../../components/form/form.css', './team-editor.component.css']
})
export class TeamEditorComponent extends UnSubscribable implements OnInit {
  team = { name: '', members: [], users: [] };
  members = [];
  isAddTeam = false;
  selected = [];

  memberNameFilter = new EntityFilter('name');

  constructor(
    private userManagerService: UserManagerService, private route: ActivatedRoute,
    private toastr: ToastrService, private location: Location) {
    super();
    this.isAddTeam = true;
  }

  ngOnInit() {
    this.managed(this.route.params).subscribe(params => {
      this.userManagerService.loadUsers().subscribe(users => {
        this.members = users;
        if (params.teamId !== '_') {
          this.userManagerService.getTeam(params.teamId).subscribe(team => {
            this.team = team;
            this.isAddTeam = false;
            this.members.filter(user => team.members.includes(user.email)
            ).forEach(user => {
              user.selected = true;
              this.selected.push(user);
            });
          });
        }
      });
    });
  }

  close($event: MouseEvent) {
    this.location.back();
  }
  addTeam($event: MouseEvent) {
    if (!this.team.name) {
      this.toastr.warning('please provide valid team name');
      return;
    }
    this.team.members = this.selected.map(user => user.email);
    this.team.users = this.selected;
    this.userManagerService.addTeam(this.team).subscribe(team => {
      if (team.id) {
        this.toastr.success('team created successfully');
      } else {
        this.toastr.error('error while creating team!');
      }
    },
      error => {
        const parsedError = parseApiError(error, 'error while creating team!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }
  updateTeam($event: MouseEvent) {
    if (!this.team.name) {
      this.toastr.warning('please provide valid team name');
      return;
    }
    this.team.members = this.selected.map(user => user.email);
    this.team.users = this.selected;
    this.userManagerService.updateTeam(this.team).subscribe(team => {
      if (team.id) {
        this.toastr.success('team updated successfully');
      } else {
        this.toastr.error('error while updating team!');
      }
    },
      error => {
        const parsedError = parseApiError(error, 'error while updating team!');
        this.toastr.error(parsedError.message, parsedError.title);
      });
  }

  memberSelectionChanged($event) {
    this.selected = $event;
  }
}
