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
import { tap, switchMap } from 'rxjs/operators';
import { IDashboardProjet } from '../model/data.model';
/**
* DashboardProjectService
* @author Cognizant
*/
export function createUpdateCachableResource(db: LocalStorage, group: string): (id: string, req: Observable<any>) => Observable<any> {

  return (id, req) => {
    const key = `ciqdashboard.${group}.${id}`;
    const request = req.pipe(tap((res: any) => {
      db.setItem(key, res).subscribe();
    }));
    return request;
  };
}

export function createCachableResource(db: LocalStorage, group: string, cacheOnly = false): (id: string, req: Observable<any>) => Observable<any> {

  return (id, req) => {
    const key = `ciqdashboard.${group}.${id}`;
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

  private _orgSource = new ReplaySubject<any>(1);
  private _org$ = this._orgSource.asObservable();

  private _orgsSource = new ReplaySubject<any[]>(1);
  private _orgs$ = this._orgsSource.asObservable();

  private _lobSource = new ReplaySubject<any>(1);
  private _lob$ = this._lobSource.asObservable();

  private _lobsSource = new ReplaySubject<any[]>(1);
  private _lobs$ = this._lobsSource.asObservable();

  private cachableProject = createCachableResource(this.db, 'project');
  private cachableORG = createCachableResource(this.db, 'org');
  private cachableLOB = createCachableResource(this.db, 'lob');

  constructor(private api: IDashBoardApiService, private db: LocalStorage) { }

  public loadProjects() {
    this.api.getProjects().subscribe(projects => {
      //console.log(projects); 
      this._projectsSource.next(projects); 
    },
      error => this._projectsSource.next([]));
  }
  public loadProject(id: string, category) {
    this.cachableProject(id, this.api.getProject(id, category)).subscribe(project => this._projectSource.next(project));
  }
  public getProject(id: string, category) {
    return this.cachableProject(id, this.api.getProject(id, category));
  }
  public get project$() {
    return this._project$;
  }
  public get projects$() {
    return this._projects$;
  }
  removeProject(project: IDashboardProjet, category) {
    return this.api.deleteProject(project, category);
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
  getDashboardTemplates(category): Observable<any> {
    return this.api.getDashboardTemplates(category);
  }
  getSourceTools(): Observable<any> {
    return this.api.getSourceTools();
  }
  createORG(organization: any): Observable<any> {
    return this.api.postORG(organization);
  }
  public loadORGs() {
    this.api.getORGs().subscribe(orgs => this._orgsSource.next(orgs),
      error => this._orgsSource.next([]));
  }
  public loadORG(id: string) {
    this.cachableORG(id, this.api.getORG(id)).subscribe(org => this._orgSource.next(org));
  }
  public getORG(id: string) {
    return this.cachableORG(id, this.api.getORG(id));
  }
  public get org$() {
    return this._org$;
  }
  public get orgs$() {
    return this._orgs$;
  }

  createLOB(lob: any): Observable<any> {
    return this.api.postLOB(lob);
  }
  public loadLOBs() {
    this.api.getLOBs().subscribe(lobs => this._lobsSource.next(lobs),
      error => this._lobsSource.next([]));
  }
  public loadLOB(id: string) {
    this.cachableLOB(id, this.api.getLOB(id)).subscribe(lob => this._lobSource.next(lob));
  }
  public getLOB(id: string) {
    return this.cachableLOB(id, this.api.getLOB(id));
  }
  public get lob$() {
    return this._lob$;
  }
  public set lob$(lob) {
    this._lob$ = lob;
  }
  public get lobs$() {
    return this._lobs$;
  }
  public getLOBByID(id: any): Observable<any> {
    return this.api.getLOBByID(id);
  }
  public getLOBsByOrgID(id: any): Observable<any> {
    return this.api.getLOBsByOrgID(id);
  }

  public getProjectsByLobID(id: any): Observable<any> {
    return this.api.getProjectsByLobID(id);
  }
}
