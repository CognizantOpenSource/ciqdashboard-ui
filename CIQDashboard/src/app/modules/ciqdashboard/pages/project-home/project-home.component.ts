import { Component, OnInit } from '@angular/core';
import { DashboardProjectService } from '../../services/ciqdashboard-project.service';
import { ToastrService } from 'ngx-toastr';
import { EntityFilter, UnSubscribable } from 'src/app/components/unsub';
import { environment } from 'src/environments/environment';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { UserManagerService } from 'src/app/services/auth/admin/user-manager.service';
import { forkJoin } from 'rxjs';
import { parseApiError } from 'src/app/components/util/error.util';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent extends UnSubscribable implements OnInit {

  projects$: any;
  attachment: any;

  allTeams: any[];
  selectedTeams: any[] = [];
  teamsProject: any = false;
  teamNameFilter = new EntityFilter('name');
  searchBy: string;
  get projectsFilter(): (project: any) => boolean {
    const context = this;
    return (project) => (!context.searchBy || context.searchBy === '')
      || (project && project.name.toLowerCase().includes(context.searchBy.toLowerCase()));
  }
  constructor(
    private auth: AuthenticationService,
    private projectService: DashboardProjectService, private teamsService: UserManagerService,
    private tostr: ToastrService) {
    super();
  }
  ngOnInit() {
    this.projectService.loadProjects();
    this.projects$ = this.projectService.projects$;
  }
  delete(project) {
    if (confirm(`Are you sure to delete ${project.name}?`))
      this.projectService.removeProject(project.id).subscribe(res => {
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
