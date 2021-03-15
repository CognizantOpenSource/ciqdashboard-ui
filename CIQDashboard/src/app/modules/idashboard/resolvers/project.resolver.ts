import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardProjectService } from '../services/idashboard-project.service';

@Injectable({
  providedIn: 'root'
})
export class TestReportResolver implements Resolve<any> {
  constructor(private service: DashboardProjectService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.getProject(route.paramMap.get('projectId'));
  }
}
