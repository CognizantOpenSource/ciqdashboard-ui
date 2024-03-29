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
import { DashboardProjectService } from '../../ciqdashboard/services/ciqdashboard-project.service';
import { take } from 'rxjs/operators';
/**
* AdminTeamsComponent
* @author Cognizant
*/
@Component({
  selector: 'app-admin-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['../../../components/form/form.css', './teams.component.css']
})
export class AdminTeamsComponent extends UnSubscribable implements OnInit {
  teams = [];
  selected = [];
  teamNameFilter = new EntityFilter('name');
  constructor(
    private userManagerService: UserManagerService, private auth: AuthenticationService,
    private projectService: DashboardProjectService,
    private router: Router, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    this.loadTeams();
  }
  private loadTeams() {
    this.userManagerService.getTeams().subscribe(teams => {
      this.teams = teams;
      this.loadTeamsProjects();
    });
  }
  private loadTeamsProjects() {
    this.projectService.projects$.pipe(take(1)).subscribe(projects => {
      if (this.teams && projects && projects.length) {
        const projectMap = projects.reduce((map, p) => ({ ...map, [p.id]: p }), {})
        this.teams.forEach(team => {
          this.projectService.getTeamsProjects(team.id).subscribe(maps => {
            team.projects = maps && maps.map(id => projectMap[id]).filter(it => !!it);
          });
        });
      }
    });
  }
  deleteTeam($event: MouseEvent) {
    if (this.selected.length === 0) {
      this.toastr.warning('Please select user to delete.');
      return;
    }
    if (confirm(`Are you sure to delete team/s?`)) {
      this.userManagerService.deleteTeams(getTeamIds(this.selected)).subscribe(() => {
        this.toastr.success('Team/s deleted successfully.');
        this.loadTeams();
      }, error => this.toastr.error(error.error.message));
    }
  }
  addTeam($event: MouseEvent) { this.router.navigate(['/admin/teams/_/edit']); }
  selectionChanged($event) { this.selected = $event; }
}
function getTeamIds(teamList: any[]) {
  return teamList && teamList.map(t => t.id) || [];
}
