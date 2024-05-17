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
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDashboardAPI } from './api';
import { itemTypes } from './items.data';
/**
* IDashBoardApiService
* @author Cognizant
*/
@Injectable({
  providedIn: 'root'
})
export class IDashBoardApiService {

  getUserProjects(userId: string): Observable<any> {
    return this.http.get(this.api.getUserProjects(userId));
  }
  updateUserProjects(userId: string, projectIds: string[]): Observable<any> {
    return this.http.put(this.api.getUserProjects(userId), projectIds);
  }
  getProjectMapping(projectId): Observable<any> {
    return this.http.get(this.api.getProjectMapping(projectId));
  }
  getTeamsProjects(teamId): Observable<any> {
    return this.http.get(this.api.getTeam(teamId));
  }
  updateTeamsProjects(teamId, projectIds: string[]): Observable<any> {
    return this.http.put(this.api.getTeam(teamId), projectIds);
  }
  deleteTeamsProject(teamId, projectId): Observable<any> {
    return this.http.delete(this.api.getTeamsProject(teamId, projectId));
  }
  getDashboardsItems(category): Observable<any> {
    return this.http.get(this.api.items + `?category=${category}`);
  }
  getItem(id): Observable<any> {
    return this.http.get(this.api.getItem(id));
  }
  createItem(item): Observable<any> {
    return this.http.post(this.api.items, item);
  }
  putItem(item): Observable<any> {
    return this.http.put(this.api.items, item);
  }
  deleteItem(id): Observable<any> {
    return this.http.delete(this.api.getItem(id));
  }
  getItemData(id, options,pageId?,dashboardId?,dashboardName?, projectName?, category?, categoryID?): Observable<any> {
    return this.http.post(this.api.getItemData(id,pageId,dashboardId,dashboardName, projectName, category, categoryID), options);
  }
  getdirectchartData(id,options,dashboardId?,dashboardName?, projectName?, category?, categoryID?): Observable<any> {
    return this.http.post(this.api.getdirectchartData(id,dashboardId,dashboardName, projectName, category, categoryID),options);
  }
  previewItem(item: any): Observable<any> {
    return this.http.post(this.api.previewItem, item);
  }
  searchItem(keywords): Observable<any> {
    return this.http.get(this.api.searchItems(keywords));
  }
  getSourceInfo(source: any): Observable<any> {
    return this.http.get(this.api.getSourceInfo(source));
  }
  getDataSources(): Observable<any> {
    return this.http.get(this.api.dataSources);
  }
  getFieldValues(source, field): Observable<any> {
    return this.http.get(this.api.getFieldValues(source, field));
  }
  getItemTypes(): Observable<any> {
    return of(itemTypes);
  }
  getDashboardByName(name: string): Observable<any> {
    return this.http.get(this.api.searchDashboard(name));
  }
  postDashboard(dashboard: any): Observable<any> {
    //console.log("postDashboard: " + name);
    return this.http.post(this.api.dashboards, dashboard);
  }
  putDashBoard(dashboard: any): Observable<any> {
    return this.http.put(this.api.dashboards, dashboard);
  }
  postAddTemplate(dashboardtemplate:any): Observable<any> {
    return this.http.post(this.api.addtemplate, dashboardtemplate);
  }
  deleteDashboard(id: string, category): Observable<any> {
    return this.http.delete(this.api.getDashboard(id, category));
  }

  getDashboards(id: any, category): Observable<any> {
    return this.http.get(this.api.getDashboards(id, category));
  }

  getDashboard(id: string, category): Observable<any> {
    return this.http.get(this.api.getDashboard(id, category));
  }

  putProject(project: any) {
    return this.http.put(this.api.projects, project);
  }
  postProject(project: any): Observable<any> {
    return this.http.post(this.api.projects, project);
  }
  getProjectByName(name: string): Observable<any> {
    return this.http.get(this.api.searchProject(name));
  }
  deleteProject(project: any, category): Observable<any> {
    return this.http.delete(this.api.getProject(project, category));
  }
  getProject(id: string, category): Observable<any> {
    return this.http.get(this.api.getProject(id, category));
  }
  getProjects(): Observable<any> {
    return this.http.get(this.api.projects);
  }
  getUserSettings(): Observable<any> {
    return this.http.get(this.api.userSettings);
  }
  putUserSettings(settings: any): Observable<any> {
    return this.http.put(this.api.userSettings, settings);
  }
  getSystemSettings(): Observable<any> {
    return this.http.get(this.api.systemSettings);
  }
  reloadWhitelist(): Observable<any> {
    return this.http.post(this.api.reloadWhitelist, null);
  }

  // Data Source Module Releated Services

  createdatasource(datasource: any): Observable<any> {
    return this.http.post(this.api.datasource, datasource);
  }

  updateDataSource(datasource: any): Observable<any> {
    return this.http.put(this.api.datasource, datasource);
  }

  getDataSource(id: string): Observable<any> {
    return this.http.get(this.api.getDataSource(id))
  }

  detDataSourceByid(id: string): Observable<any> {
    return this.http.delete(this.api.detDataSourceByid(id))
  }


  getDataSourceByName(name: string): Observable<any> {
    return this.http.get(this.api.searchDatasource(name));
  }

  getcollectionName(): Observable<any> {
    return this.http.get(this.api.getcollectionName());
  }

  getFieldsTypes(name: string): Observable<any> {
    return this.http.get(this.api.getFieldsTypes(name));
  }

  addExternalData(data: any, collname: string): Observable<any> {
    collname = collname.trim();
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    const options = { headers: httpHeaders, params: new HttpParams().set('collectionName', collname) };
    return this.http.post(this.api.addExtdata, data, options);
  }

  updateExternalData(data: any, collname: string): Observable<any> {
    collname = collname.trim();
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    const options = { headers: httpHeaders, params: new HttpParams().set('collectionName', collname).set('override', 'true') };
    return this.http.put(this.api.updateExtdata, data, options);
  }

  createView(data: any): Observable<any> {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    const options = { headers: httpHeaders };
    return this.http.post(this.api.createView, data, options);
  }

  api: IDashboardAPI;
  public apiHosts: any;
  constructor(private http: HttpClient) {
    this.api = new IDashboardAPI(environment.api.idashboard);
    this.apiHosts = environment.api;
  }
  getDashboardTemplates(category: string): Observable<any> {
    return this.http.get<any[]>(this.api.templates + category);
  }

  getMetricsData(dashboardName, projectName, itemId) {
    let requestbody = {
      "dashboardName": dashboardName,
      "projectName": projectName
    };
    // this.http.post<any[]>('http://localhost:2021/items/' + itemId + '/metric-data', requestbody).subscribe((response: any) => {

    this.http.post<any[]>(environment.api.idashboard + 'items/' + itemId + '/metric-data', requestbody).subscribe((response: any) => {
      // console.log(response);
      return response.data;
    }, (error) => {
      console.log(error);
    });
  }
  getSourceTools(): Observable<any> {
    return this.http.get<any[]>(environment.api.idashboard + 'projects/source_data');
  }
  postORG(organization: any): Observable<any> {
    return this.http.post(this.api.orgs, organization);
  }
  getORGs(): Observable<any> {
    return this.http.get(this.api.getORGs());
  }
  getORG(id: string): Observable<any> {
    return this.http.get(this.api.getORG(id));
  }
  postLOB(lob: any): Observable<any> {
    return this.http.post(this.api.lobs, lob);
  }
  getLOBs(): Observable<any> {
    return this.http.get(this.api.getLOBs());
  }
  getLOB(id: string): Observable<any> {
    return this.http.get(this.api.getLOB(id));
  }
  getLOBByID(id: string): Observable<any> {
    return this.http.get(this.api.getLOBByID(id));
  }
  getLOBsByOrgID(id: string): Observable<any> {
    return this.http.get(this.api.getLOBsByOrgID(id));
  }
  getProjectsByLobID(id: string): Observable<any> {
    return this.http.get(this.api.getProjectsByLobID(id));
  }
}