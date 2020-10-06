import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, merge } from 'rxjs';
import { IDashBoardApiService } from './idashboard-api.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { IDashboardProjet } from '../model/data.model';

export function createUpdateCachableResource(db: LocalStorage, group: string): (id: string, req: Observable<any>) => Observable<any> {

  return (id, req) => {
    const key = `idashboard.${group}.${id}`;
    const request = req.pipe(tap((res: any) => {
      db.setItem(key, res).subscribe();
    }));
    return request;
  };
}

export function createCachableResource(db: LocalStorage, group: string, cacheOnly = false): (id: string, req: Observable<any>) => Observable<any> {

  return (id, req) => {
    const key = `idashboard.${group}.${id}`;
    return db.hasKey(key).pipe(switchMap(exist => {
      const request = req.pipe(tap((res: any) => {
        db.setItem(key, res).subscribe();
      }));
      return exist ? (cacheOnly ? db.getItem(key) : merge(db.getItem(key), request)) : request;
    }));
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardProjectService {

  private _projectSource = new ReplaySubject<IDashboardProjet>(1);
  private _project$ = this._projectSource.asObservable();

  private _projectsSource = new ReplaySubject<IDashboardProjet[]>(1);
  private _projects$ = this._projectsSource.asObservable();

  private cachableProject = createCachableResource(this.db, 'project');

  constructor(
    private api: IDashBoardApiService, private db: LocalStorage, private toastr: ToastrService) {

  }

  public loadProjects() {
    this.api.getProjects().subscribe(projects => this._projectsSource.next(projects),
      error => this._projectsSource.next([]));
  }
  public loadProject(id: string) {
    this.cachableProject(id, this.api.getProject(id)).subscribe(project => this._projectSource.next(project));
  }
  public getProject(id: string) {
    return this.cachableProject(id, this.api.getProject(id));
  }
  public get project$() {
    return this._project$;
  }
  public get projects$() {
    return this._projects$;
  }
  clear() {
    this.db.deleteItem('project').subscribe();
  }
  removeProject(project: IDashboardProjet) {
    this.api.deleteProject(project).subscribe(res => {
      this.toastr.success('project deleted successfully');
      this.loadProjects();
    }, error => this.toastr.error('error while deleting project'));
  }
  createProject(project: any): Observable<any> {
    return this.api.postProject(project);
  }
  searchProject(name: string): Observable<any> {
    return this.api.getProjectByName(name);
  }
}
