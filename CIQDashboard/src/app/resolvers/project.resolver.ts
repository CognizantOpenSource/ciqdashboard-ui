import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardProjectService } from '../modules/ciqdashboard/services/ciqdashboard-project.service';
@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {
  constructor(private projectService: DashboardProjectService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.projectService.getProject(route.paramMap.get('id'));
  }
}
