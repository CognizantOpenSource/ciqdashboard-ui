import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, merge, of } from 'rxjs';
import { IDashBoardApiService } from './idashboard-api.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { createCachableResource, createUpdateCachableResource } from './idashboard-project.service';
import { IDashboardProjet, IDashboard } from '../model/data.model';
import { IDashboardConfig } from 'src/app/model/report.model';

interface ItemWizardEvent {
  type: 'created' | 'updated';
  template?: 'new';
  data: any;
}
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
      error => this.emit(projectId, []));
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
    this.api.deleteDashboard(dashboard.id).subscribe(res => {
      this.toastr.success('dashboard deleted successfully');
      this._dashboards$.pipe(take(1)).subscribe(ds => {
        this.emit(ds.project, ds.data.filter(d => d.id !== dashboard.id));
      });
    }, error => this.toastr.error('error while deleting dashboard'));
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
