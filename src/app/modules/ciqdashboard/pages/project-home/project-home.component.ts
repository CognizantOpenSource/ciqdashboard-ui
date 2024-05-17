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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
* ProjectHomeComponent
* @author Cognizant
*/
@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectHomeComponent extends UnSubscribable implements OnInit {

  projects$: any = [];
  attachment: any;

  allTeams: any[];
  selectedTeams: any[] = [];
  teamsProject: any = false;
  teamNameFilter = new EntityFilter('name');
  searchBy: string;
  lobId: string = '';
  get projectsFilter(): (project: any) => boolean {
    const context = this;
    if (context.lobId != '') {
      return (project) => (((project.lobId === context.lobId)));
    } else {
      return (project) => (!context.searchBy || context.searchBy === '')
        || (project && project.name.toLowerCase().includes(context.searchBy.toLowerCase()));
    }
  }
  constructor(
    private auth: AuthenticationService,
    private projectService: DashboardProjectService, private teamsService: UserManagerService,
    private tostr: ToastrService,
    private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit() {
    this.projectService.loadProjects();
    this.projects$ = this.projectService.projects$;
    this.route.queryParams.pipe(take(1)).subscribe(q => {
      if (q.hasOwnProperty("lobId")) {
        //console.log("lobId:" + q.lobId);
        this.lobId = q.lobId;
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
  delete(project) {
    if (confirm(`Are you sure to delete ${project.name}?`))
      this.projectService.removeProject(project.id, 'PRJ').subscribe(res => {
        this.tostr.success('project deleted successfully');
        this.projectService.loadProjects();
      }, error => {
        const parsedError = parseApiError(error, 'error while deleting project');
        this.tostr.error(parsedError.message, parsedError.title);
      });
  }
  showSettings(project) {

  }
  showTeams(project) {
    this.allTeams = undefined;
    forkJoin(this.teamsService.getTeams(), this.projectService.getProjectMapping(project.id)).subscribe(([teams, map]: any[]) => {
      this.allTeams = teams;
      if (map.teamIds && map.teamIds.length)
        this.selectedTeams = this.allTeams.filter(team => map.teamIds.includes(team.id));
      this.teamsProject = project.id;
    });
  }
  updateTeamsMapping(projectId) {
    const selectedTeamIds = this.selectedTeams.map(t => t.id);
    const toAdd = selectedTeamIds.map(teamId => ({ teamId, projectId }));
    const toRemove = this.allTeams.filter(t => !selectedTeamIds.includes(t.id)).map(t => ({ teamId: t.id, projectId }));
    forkJoin([...toAdd.map(e => this.projectService.updateTeamsProjects(e.teamId, [e.projectId])),
    ...toRemove.map(e => this.projectService.deleteTeamsProject(e.teamId, e.projectId))]).subscribe(res => {
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
