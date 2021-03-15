import { Component, OnInit } from '@angular/core';
import { DashboardProjectService } from '../../services/idashboard-project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take, distinctUntilChanged, map } from 'rxjs/operators';
import { UnSubscribable } from 'src/app/components/unsub';
import { DashboardItemsService } from '../../services/idashboard-items.service';

@Component({
  selector: 'app-wrapper',
  template: `<router-outlet></router-outlet>
  <router-outlet name="modal"></router-outlet>`,
  styles: []
})
export class WrapperComponent extends UnSubscribable implements OnInit {

  constructor(
    private projectService: DashboardProjectService, private dashItemService: DashboardItemsService, private router: Router,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.managed(this.route.params.pipe(map(p => p.projectId), distinctUntilChanged())).subscribe(projectId => {
      if (projectId) {
        this.projectService.loadProject(projectId);
      } else {
        this.projectService.projects$.pipe(take(1)).subscribe(projects => {
          this.router.navigate([projects[0].id], { relativeTo: this.route });
        });
      }
    });
  }

}
