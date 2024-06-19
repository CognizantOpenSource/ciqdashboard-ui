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
import { ActivatedRoute } from '@angular/router';
import { distinct, map, take } from 'rxjs/operators';
/**
* LOBHomeComponent
* @author Cognizant
*/
@Component({
  selector: 'app-lob-home',
  templateUrl: './lob-home.component.html',
  styleUrls: ['./lob-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LOBHomeComponent extends UnSubscribable implements OnInit {

  lobs$: any;
  attachment: any;

  allTeams: any[];
  selectedTeams: any[] = [];
  teamsProject: any = false;
  teamNameFilter = new EntityFilter('name');
  searchBy: string;
  orgId: string = '';
  get lobsFilter(): (lob: any) => boolean {
    const context = this;
    if (context.orgId != '') {
      return (lob) => (((lob.orgId === context.orgId)));
    } else {
    return (lob) => (!context.searchBy || context.searchBy === '')
      || (lob && lob.name.toLowerCase().includes(context.searchBy.toLowerCase()));
    }
  }
  constructor(
    private auth: AuthenticationService,
    private lobService: DashboardProjectService, private teamsService: UserManagerService,
    private tostr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute) {
    super();
  }
  ngOnInit() {
    this.lobService.loadLOBs();
    this.lobs$ = this.lobService.lobs$;
    this.route.queryParams.pipe(take(1)).subscribe(q => {
      if (q.hasOwnProperty("orgId")) {
        //console.log("orgId:" + q.orgId);
        this.orgId = q.orgId;
        /*  this.projects$ = this.projectService.projects$.subscribe(projects => {
           return projects.filter(obj=>{return (obj.lobId === q.lobId)});
           //projects.filter({projects.lobId===q.lobId});
         }).add(obj => {
           //console.log(obj);
           this.cdRef.detectChanges();
           this.cdRef.markForCheck();
         });
         // this.lobId = q.lobId;
         this.projectsFilter(); */
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      }
    });
  }
  delete(lob) {
    if (confirm(`Are you sure to delete ${lob.name}?`))
      this.lobService.removeProject(lob.id,'LOB').subscribe(res => {
        this.tostr.success('lob deleted successfully');
        this.lobService.loadProjects();
      }, error => {
        const parsedError = parseApiError(error, 'error while deleting lob');
        this.tostr.error(parsedError.message, parsedError.title);
      });
  }
  showSettings(lob) {

  }
  showTeams(lob) {
    this.allTeams = undefined;
    /* forkJoin(this.teamsService.getTeams(), this.lobService.getProjectMapping(lob.id)).subscribe(([teams, map]: any[]) => {
      this.allTeams = teams;
      if (map.teamIds && map.teamIds.length)
        this.selectedTeams = this.allTeams.filter(team => map.teamIds.includes(team.id));
      this.teamsProject = lob.id;
    }); */

    this.lobService.getProjectsByLobID(lob.id).subscribe(projects => {
      this.allTeams = projects;
      this.teamsProject = lob.id;
      this.cdRef.markForCheck(); 
    },
      error => {
        console.log(error);
      });
  }
  updateTeamsMapping(lobId) {
    const selectedTeamIds = this.selectedTeams.map(t => t.id);
    const toAdd = selectedTeamIds.map(teamId => ({ teamId, lobId }));
    const toRemove = this.allTeams.filter(t => !selectedTeamIds.includes(t.id)).map(t => ({ teamId: t.id, lobId }));
    forkJoin([...toAdd.map(e => this.lobService.updateTeamsProjects(e.teamId, [e.lobId])),
    ...toRemove.map(e => this.lobService.deleteTeamsProject(e.teamId, e.lobId))]).subscribe(res => {
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
