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
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { IDashBoardApiService } from './ciqdashboard-api.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { tap, take } from 'rxjs/operators';
import { createCachableResource, createUpdateCachableResource } from './ciqdashboard-project.service';
import { IDashboardProjet, IDashboard } from '../model/data.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _dashboardSource = new ReplaySubject<any>(1);
  private _dashboard$ = this._dashboardSource.asObservable();

  private _dashboardsSource = new ReplaySubject<any>(1);
  private _dashboards$ = this._dashboardsSource.asObservable();

  private cachableDashboard = createCachableResource(this.db, 'dashboard');
  private updateCacheDashboard = createUpdateCachableResource(this.db, 'dashboard');

  constructor(
    private api: IDashBoardApiService, private db: LocalStorage, private toastr: ToastrService) {
  }
  private emit(project, data) {
    this._dashboardsSource.next({ project, data });
  }
  public loadDashboards(projectId) {
    this.api.getDashboards(projectId).subscribe(dashboards => this.emit(projectId, dashboards),
      () => this.emit(projectId, []));
  }
  public loadDashboard(id: string) {
    this.getDashboard(id).subscribe(dashboard => this._dashboardSource.next(dashboard));
  }
  public getDashboard(id: string) {
    return this.cachableDashboard(id, this.api.getDashboard(id));
  }
  public get dashboard$() {
    return this._dashboard$;
  }
  public get dashboards$() {
    return this._dashboards$;
  } 
  removeDashboard(dashboard: IDashboardProjet,) {
    this.api.deleteDashboard(dashboard.id).subscribe(() => {
      this.toastr.success('dashboard deleted successfully');
      this._dashboards$.pipe(take(1)).subscribe(ds => {
        this.emit(ds.project, ds.data.filter(d => d.id !== dashboard.id));
      });
    }, () => this.toastr.error('error while deleting dashboard'));
  }
  createDashboard(dashboard: IDashboard): Observable<any> {
    return this.api.postDashboard(dashboard).pipe(tap(dash => {
      this.updateCacheDashboard(dash.id, of(dash)).subscribe();
      this._dashboards$.pipe(take(1)).subscribe(ds => {
        this.emit(ds.project, [...ds.data, dash]);
      });
    }));
  }
  searchDashboard(name: string): Observable<any> {
    return this.api.getDashboardByName(name);
  }
  save(dashboard: IDashboard) {
    dashboard.pages.forEach(page => {
      if(page.items){
        page.items = page.items.filter(it => !!it);
      }
    })
    return this.updateCacheDashboard(dashboard.id, this.api.putDashBoard(dashboard));
  }
}
