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
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { ToastrService } from 'ngx-toastr';
import { EntityFilter, UnSubscribable } from 'src/app/components/unsub';
import { environment } from 'src/environments/environment';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { forkJoin } from 'rxjs';
import { parseApiError } from 'src/app/components/util/error.util';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
/**
* ProjectHomeComponent
* @author Cognizant
*/
@Component({
  selector: 'app-org-home',
  templateUrl: './org-home.component.html',
  styleUrls: ['./org-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ORGHomeComponent extends UnSubscribable implements OnInit {

  orgs$: any;
  attachment: any;

  allTeams: any[];
  selectedTeams: any[] = [];
  teamsProject: any = false;
  teamNameFilter = new EntityFilter('name');
  searchBy: string;
  get orgsFilter(): (org: any) => boolean {
    const context = this;
    return (org) => (!context.searchBy || context.searchBy === '')
      || (org && org.name.toLowerCase().includes(context.searchBy.toLowerCase()));
  }
  constructor(
    private auth: AuthenticationService,
    private orgService: DashboardProjectService, private teamsService: UserManagerService,
    private tostr: ToastrService,
    private cdRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit() {
    this.orgService.loadORGs();
    this.orgs$ = this.orgService.orgs$;
  }
  delete(org) {
    if (confirm(`Are you sure to delete ${org.name}?`))
      this.orgService.removeProject(org.id, 'ORG').subscribe(res => {
        this.tostr.success('organization deleted successfully');
        this.orgService.loadORGs();
      }, error => {
        const parsedError = parseApiError(error, 'error while deleting organization');
        this.tostr.error(parsedError.message, parsedError.title);
      });
  }
  showSettings(org) {

  }
  showTeams(org) {
    this.allTeams = undefined;
    /* forkJoin(this.teamsService.getTeams(), this.orgService.getProjectMapping(org.id)).subscribe(([teams, map]: any[]) => {
      this.allTeams = teams;
      if (map.teamIds && map.teamIds.length)
        this.selectedTeams = this.allTeams.filter(team => map.teamIds.includes(team.id));
      this.teamsProject = org.id;
    }); */

    this.orgService.getLOBsByOrgID(org.id).subscribe(lobs => {
      this.allTeams = lobs;
      this.teamsProject = org.id;
      this.cdRef.markForCheck();
    },
      error => {
        console.log(error);
      });
  }
  updateTeamsMapping(orgId) {
    const selectedTeamIds = this.selectedTeams.map(t => t.id);
    const toAdd = selectedTeamIds.map(teamId => ({ teamId, orgId }));
    const toRemove = this.allTeams.filter(t => !selectedTeamIds.includes(t.id)).map(t => ({ teamId: t.id, orgId }));
    forkJoin([...toAdd.map(e => this.orgService.updateTeamsProjects(e.teamId, [e.orgId])),
    ...toRemove.map(e => this.orgService.deleteTeamsProject(e.teamId, e.orgId))]).subscribe(res => {
      if (res) {
        this.tostr.success('team details updated successfully');
      } else {
        this.tostr.error('error while updating team deatils!');
      }
    },
      error => {
        const parsedError = parseApiError(error, 'error while updating team details!');
        this.tostr.error(parsedError.message, parsedError.title);
      });
  }
}
