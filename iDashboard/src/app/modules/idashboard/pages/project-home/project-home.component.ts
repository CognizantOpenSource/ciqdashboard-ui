import { Component, OnInit } from '@angular/core';
import { DashboardProjectService } from '../../services/idashboard-project.service';
import { ToastrService } from 'ngx-toastr';
import { UnSubscribable } from 'src/app/components/unsub';
import { environment } from 'src/environments/environment';
import { LocalStorage } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent extends UnSubscribable implements OnInit {

  projects$: any;
  attachment: any;
  constructor(
    private projectService: DashboardProjectService,
    private tostr: ToastrService, private localStorage: LocalStorage) {
    super();
  }
  ngOnInit() {
    this.projectService.loadProjects();
    this.projects$ = this.projectService.projects$;
  }
  delete(project) {
    if (confirm(`Are you sure to delete ${project.name}?`))
      this.projectService.removeProject(project.id);
  }
  showSettings(project) {
    
  }
}
