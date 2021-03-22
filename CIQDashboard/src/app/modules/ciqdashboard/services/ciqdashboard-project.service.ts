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
import { Observable, ReplaySubject, merge, forkJoin } from 'rxjs';
import { IDashBoardApiService } from './ciqdashboard-api.service';
import { LocalStorage } from 'src/app/services/local-storage.service';
import {tap, switchMap } from 'rxjs/operators';
import { IDashboardProjet } from '../model/data.model';
/**
* DashboardProjectService
* @author Cognizant
*/
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

  constructor(private api: IDashBoardApiService, private db: LocalStorage) { }

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
  removeProject(project: IDashboardProjet) {
    return this.api.deleteProject(project);
  }
  createProject(project: any): Observable<any> {
    return this.api.postProject(project);
  }
  searchProject(name: string): Observable<any> {
    return this.api.getProjectByName(name);
  }
  getUserProjects(userId: string): Observable<string[]> {
    return this.api.getUserProjects(userId);
  }
  updateUserProjects(userId: string, projectIds: string[]): Observable<any> {
    return this.api.updateUserProjects(userId, projectIds);
  }
  getProjectMapping(projectId: string): Observable<any> {
    return this.api.getProjectMapping(projectId);
  }
  getTeamsProjects(teamId): Observable<any[]> {
    return this.api.getTeamsProjects(teamId);
  }
  updateTeamsProjects(teamId, projectIds: string[]): Observable<any> {
    return this.api.updateTeamsProjects(teamId, projectIds);
  }
  deleteTeamsProject(teamId, projectId): Observable<any> {
    return this.api.deleteTeamsProject(teamId, projectId);
  }
  deleteTeamsProjects(teamId, projectIds: string[] = []): Observable<any> {
    return forkJoin(projectIds.map(id => this.deleteTeamsProject(teamId, id)));
  }
}
